

import express from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();


const app = express();
app.use(express.json());``
app.use(cors());

// Health check or root endpoint
app.get('/', (req, res) => {
  res.json({ status: 'AIQ backend is running' });
});


const provider = new ethers.JsonRpcProvider(process.env.NODE_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);


const contractAbi = [
  "function exchange(address stablecoin, uint256 stablecoinAmount) external",
];


const contract = new ethers.Contract(
  process.env.MINTING_CONTRACT_ADDRESS,
  contractAbi,
  wallet
);


app.post('/mint', async (req, res) => {
  try {
    const { stablecoin, amount } = req.body;
    if (!stablecoin || !amount) {
      return res.status(400).json({ error: 'Missing stablecoin or amount' });
    }
    // Convert human amount (e.g., 100 USDT) to smallest unit (6 decimals)
    const parsedAmount = ethers.parseUnits(amount.toString(), 6);
    // Approve minting contract to spend stablecoin
    const erc20Abi = ["function approve(address spender, uint256 amount) external returns (bool)"];
    const tokenContract = new ethers.Contract(stablecoin, erc20Abi, wallet);
    const approveTx = await tokenContract.approve(process.env.MINTING_CONTRACT_ADDRESS, parsedAmount);
    await approveTx.wait();
    // Mint
    const tx = await contract.exchange(stablecoin, parsedAmount);
    await tx.wait();
    res.json({ success: true, approveTx: approveTx.hash, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Staking contract ABI (minimal)
const stakingAbi = [
  "function stake(uint256 amount, uint8 plan) external",
  "function claimRewards(uint8 plan) external"
];

const stakingContract = new ethers.Contract(
  process.env.STAKING_CONTRACT_ADDRESS,
  stakingAbi,
  wallet
);
// POST /stake { amount, plan }
app.post('/stake', async (req, res) => {
  try {
    const { amount, plan } = req.body;
    if (!amount || plan === undefined) {
      return res.status(400).json({ error: 'Missing amount or plan' });
    }
    // Approve staking contract to spend AIQ
    const erc20Abi = ["function approve(address spender, uint256 amount) external returns (bool)"];
    const aiqToken = new ethers.Contract(process.env.AIQ_TOKEN_ADDRESS, erc20Abi, wallet);
    const parsedAmount = ethers.parseUnits(amount.toString(), 18);
    const approveTx = await aiqToken.approve(process.env.STAKING_CONTRACT_ADDRESS, parsedAmount);
    await approveTx.wait();
    // Stake
    const tx = await stakingContract.stake(parsedAmount, plan);
    await tx.wait();
    res.json({ success: true, approveTx: approveTx.hash, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /claim-rewards { plan }
app.post('/claim-rewards', async (req, res) => {
  try {
    const { plan } = req.body;
    if (plan === undefined) {
      return res.status(400).json({ error: 'Missing plan' });
    }
    const tx = await stakingContract.claimRewards(plan);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port http://localhost:${PORT}`);
});
