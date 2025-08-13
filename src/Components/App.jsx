import React from 'react';
import { useAccount, useDisconnect, useWalletClient } from 'wagmi';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Input } from './ui/input';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import { Toaster } from './ui/sonner';
import { notifySuccess, notifyError } from '../lib/notify';
import AIQ_logo from '../assets/AIQ_logo.png';
import search_icon from '../assets/search_icon.png';
import fff from '../assets/MintIcon.png';
import staking_icon from  '../assets/staking_icon.svg'
import claim from  '../assets/claim.svg'


function App() {
  // Wallet/account hooks (must be declared before use)
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();

  // User balances
  const [stablecoinBalance, setStablecoinBalance] = React.useState('');
  const [aiqBalance, setAiqBalance] = React.useState('');

  // Mint states
  const [loading, setLoading] = React.useState(false);
  const [mintStep, setMintStep] = React.useState('idle'); // idle | approving | confirming | minting
  const [stablecoin, setStablecoin] = React.useState('USDT');
  const [amount, setAmount] = React.useState('');

  // Fetch balances when wallet or selected token changes
  React.useEffect(() => {
    async function fetchBalances() {
      if (!isConnected || !window.ethereum || !address) {
        setStablecoinBalance('');
        setAiqBalance('');
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        // Stablecoin balance
        const token = stablecoins[stablecoin];
        const erc20 = new ethers.Contract(token.address, ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"], provider);
        const bal = await erc20.balanceOf(address);
        const decimals = token.decimals;
        setStablecoinBalance(Number(ethers.formatUnits(bal, decimals)).toLocaleString());
        // AIQ balance
        const aiq = new ethers.Contract(aiqTokenAddress, ["function balanceOf(address) view returns (uint256)"], provider);
        const aiqBal = await aiq.balanceOf(address);
        setAiqBalance(Number(ethers.formatUnits(aiqBal, 18)).toLocaleString());
      } catch {
        setStablecoinBalance('');
        setAiqBalance('');
      }
    }
    fetchBalances();
  }, [isConnected, address, stablecoin]);

  // Staking states
  const [stakeAmount, setStakeAmount] = React.useState('');
  const [stakePlan, setStakePlan] = React.useState('THREE_MONTHS');
  const [stakeLoading, setStakeLoading] = React.useState(false);
  const [stakeStep, setStakeStep] = React.useState('idle'); // idle | approving | confirming | staking

  // Claim rewards states
  const [claimPlan, setClaimPlan] = React.useState('THREE_MONTHS');
  const [claimLoading, setClaimLoading] = React.useState(false);
  const [claimStep, setClaimStep] = React.useState('idle'); // idle | confirming | claiming

  // Animated ellipsis for status text
  const [dotCount, setDotCount] = React.useState(0);
  React.useEffect(() => {
    let interval;
    if (loading || stakeLoading || claimLoading) {
      interval = setInterval(() => {
        setDotCount((prev) => (prev + 1) % 4);
      }, 500);
    } else {
      setDotCount(0);
    }
    return () => clearInterval(interval);
  }, [loading, stakeLoading, claimLoading]);

  const dots = '.'.repeat(dotCount);

  // Stablecoin addresses and decimals
  const stablecoins = {
    USDT: { address: '0x0938E316F1B7F517F6CeaAf9fE4D4b25266b8D2C', decimals: 6 },
    USDC: { address: '0xc247beDaF2745A22A93a7A2Da41457FcBdEf686b', decimals: 6 },
    DAI:  { address: '0x06FF24582aaAb1521A5dbBFfc9b16C870FB56Afa', decimals: 6 },
  };
  const mintingAddress = '0x25F9435F4439DD798C71fB202174a05fa4D8d3b5';
  const mintingAbi = ["function exchange(address stablecoin, uint256 stablecoinAmount) external"];
  const erc20Abi = ["function approve(address spender, uint256 amount) external returns (bool)"];

  // Staking contract
  const stakingAddress = '0xD77fC167E8f047927ddf62BE32EB39dF3C1d87d4';
  const aiqTokenAddress = '0xE2A08540C244434a1afd19A7ff2B38f284B3458B';
  const stakingAbi = [
    "function stake(uint256 amount, uint8 plan) external",
    "function claimRewards(uint8 plan) external"
  ];

  // Calculate AIQ to receive
  let aiqAmount = '';
  if (amount && !isNaN(amount)) {
    aiqAmount = (parseFloat(amount) / 100).toString();
  }
  const handleMint = async () => {
    if (!isConnected) {
      notifyError('Please connect your wallet first.');
      return;
    }
    if (!window.ethereum) {
      notifyError('No wallet found!');
      return;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      notifyError('Enter a valid amount');
      return;
    }
    setLoading(true);
    setMintStep('approving');
    try {
      const token = stablecoins[stablecoin];
      const parsedAmount = ethers.parseUnits(amount, token.decimals);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // Approve selected stablecoin for minting contract (wait for confirmation before proceeding)
      const tokenContract = new ethers.Contract(token.address, erc20Abi, signer);
      const approveTx = await tokenContract.approve(mintingAddress, parsedAmount);
      setMintStep('confirming');
      await approveTx.wait();
      setMintStep('minting');
      // After approval, call minting contract
      const minting = new ethers.Contract(mintingAddress, mintingAbi, signer);
      const tx = await minting.exchange(token.address, parsedAmount);
      await tx.wait();
      setLoading(false);
      setMintStep('idle');
  notifySuccess('Mint successful!');
    } catch (err) {
      setLoading(false);
      setMintStep('idle');
  notifyError('Mint failed: ' + (err?.message || err));
    }
  };

  // Plan mapping for contract
  const planMap = {
    'THREE_MONTHS': 0,
    'SIX_MONTHS': 1,
    'TWELVE_MONTHS': 2
  };

  // Stake handler
  const handleStake = async () => {
    if (!isConnected) {
      notifyError('Please connect your wallet first.');
      return;
    }
    if (!window.ethereum) {
      notifyError('No wallet found!');
      return;
    }
    if (!stakeAmount || isNaN(stakeAmount) || parseFloat(stakeAmount) <= 0) {
      notifyError('Enter a valid AIQ amount');
      return;
    }
    setStakeLoading(true);
    setStakeStep('approving');
    try {
      const parsedAmount = ethers.parseUnits(stakeAmount, 18);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // Approve staking contract to spend AIQ
      const aiqToken = new ethers.Contract(aiqTokenAddress, erc20Abi, signer);
      const approveTx = await aiqToken.approve(stakingAddress, parsedAmount);
      setStakeStep('confirming');
      await approveTx.wait();
      setStakeStep('staking');
      // Stake
      const staking = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const tx = await staking.stake(parsedAmount, planMap[stakePlan]);
      await tx.wait();
      setStakeLoading(false);
      setStakeStep('idle');
  notifySuccess('Stake successful!');
    } catch (err) {
      setStakeLoading(false);
      setStakeStep('idle');
  notifyError('Stake failed: ' + (err?.message || err));
    }
  };

  // Claim rewards handler
  const handleClaimRewards = async () => {
    if (!isConnected) {
      notifyError('Please connect your wallet first.');
      return;
    }
    if (!window.ethereum) {
      notifyError('No wallet found!');
      return;
    }
    setClaimLoading(true);
    setClaimStep('confirming');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const staking = new ethers.Contract(stakingAddress, stakingAbi, signer);
      const tx = await staking.claimRewards(planMap[claimPlan]);
      setClaimStep('claiming');
      await tx.wait();
      setClaimLoading(false);
      setClaimStep('idle');
  notifySuccess('Claim successful!');
    } catch (err) {
      setClaimLoading(false);
      setClaimStep('idle');
  notifyError('Claim failed: ' + (err?.message || err));
    }
  };

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
          },
          className: 'font-medium',
        }}
      />
      <div className="min-h-screen flex flex-col">
        <div className="flex justify-between items-center bg-[#131313] px-[120px] py-[14px] text-white font-[Haas_Grot_Disp_Trial] flex-shrink-0">
          <div>
            <img src={AIQ_logo} alt="AiQ logo" />
          </div>
          <div>
            <a href="">Products</a>
            <a href="" className="px-[40px]">Market</a>
            <a href="">$AIG</a>
          </div>
          <div className="flex items-center relative" style={{ zIndex: 20 }}>
            <ConnectButton.Custom>
              {({ account, openConnectModal, mounted }) => {
                return (
                  <button
                    className="whitespace-nowrap mr-[32px] border-white border font-medium bg-black rounded-xl py-2 px-7 shadows relative cursor-pointer"
                    style={{
                      background:
                        "radial-gradient(circle at 85% -30%, rgba(255,255,255,0.3), transparent 30%)",
                    }}
                    onClick={account ? disconnect : openConnectModal}
                  >
                    {account
                      ? `${account.displayName} (Disconnect)`
                      : 'Connect Wallet'}
                  </button>
                );
              }}
            </ConnectButton.Custom>
            <div className="main-shadow"></div>
            <div className="sub-shadow"></div>
            <img src={search_icon} alt="" className="h-6 w-6" />
          </div>
        </div>
  <div className="bg-gradient-to-t from-[#101010] to-[#2A2A2A] flex-1 flex flex-col justify-center">
          <div className="text-white pt-8 mb-4">
            <h1 className="mb-2 text-center ">Mint, Stake and Earn</h1>
          </div>
          <div className="flex justify-center gap-4 items-stretch">
            {/* Mint Card */}
            <div className="bg-[#141414] text-white rounded-2xl pt-4 max-w-[344px] w-full flex flex-col whitespace-nowrap">
              <figure className="mb-4 flex justify-center flex-col items-center ">
                <div className="bg-[#1E1E1E] rounded-full m-auto    w-[88px] h-[88px] flex items-center justify-center ">
                  <img src={fff} alt="" className="  p-[17px] m-auto " />
                </div>
                <figcaption className="font-medium text-2xl mt-2">
                  Minting
                </figcaption>
              </figure>
              {/* Stablecoin selector and amount input */}
              <div className="flex flex-col gap-1 px-4 pb-2 flex-grow">
                <label className="text-sm mb-1">Stablecoin</label>
                  <Select value={stablecoin} onValueChange={setStablecoin}>
                    <SelectTrigger className="bg-[#232323] text-white rounded-xl px-4 py-2 border border-white min-h-[44px] w-full focus:ring-0 focus:border-[#aaa] hover:bg-[#23282a] hover:border-[#aaa] transition-colors">
                      <SelectValue placeholder="Select stablecoin" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#232323] text-white rounded-xl border border-white w-full">
                      <SelectItem value="USDT" className="hover:bg-[#33383a] !bg-[#232323] cursor-pointer transition-colors">USDT</SelectItem>
                      <SelectItem value="USDC" className="hover:bg-[#33383a] !bg-[#232323] cursor-pointer transition-colors">USDC</SelectItem>
                      <SelectItem value="DAI" className="hover:bg-[#33383a] !bg-[#232323] cursor-pointer transition-colors">DAI</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-xs text-[#aaa] mt-1 mb-1">{stablecoin} balance: <span className="font-bold text-white">{stablecoinBalance !== '' ? stablecoinBalance : '--'}</span></div>
                <label className="text-sm mt-2 mb-1">Amount</label>
                <Input
                  className="bg-[#222] text-white rounded-xl px-4 py-2 border border-white min-h-[44px] w-full focus:outline-none focus:ring-0 focus:border-white transition-all duration-150 placeholder-[#888] shadow-sm hover:border-[#888] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&[type=number]]:appearance-none"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  inputMode="decimal"
                />
                  <div className="text-xs text-[#aaa] mb-1">AIQ balance: <span className="font-bold text-white">{aiqBalance !== '' ? aiqBalance : '--'}</span></div>
              </div>
              <div
                className="mt-auto flex justify-center pb-1 mb-4"
                style={{ zIndex: 29 }}
              >
                <button
                  className="whitespace-nowrap border one h-[41px] w-[237px]  bg-black mx-auto rounded-xl font-medium  relative  text-[16px] "
                  style={{
                    background:
                      "radial-gradient(circle at 85% -80%, rgba(255,255,255,0.3), transparent 30%)",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleMint}
                  disabled={!isConnected || loading}
                >
                  {loading
                    ? mintStep === 'approving'
                      ? `Processing${dots}`
                      : mintStep === 'confirming'
                      ? `Confirm in wallet${dots}`
                      : mintStep === 'minting'
                      ? `Minting${dots}`
                      : `Processing${dots}`
                    : 'Mint'}
                </button>
              </div>
            </div>
            {/* Staking Card */}
            <div className="bg-[#141414] text-white rounded-2xl pt-4 max-w-[344px] min-h-[344px] w-full flex flex-col justify-between">
              <figure className="mb-4 flex justify-center flex-col items-center ">
                <div className="bg-[#1E1E1E] rounded-full m-auto w-[88px] h-[88px] flex items-center justify-center ">
                  <img src={staking_icon} alt="" className="p-[17px] m-auto " />
                </div>
                <figcaption className="font-medium text-2xl mt-2">Staking</figcaption>
              </figure>
              {/* Plan selector and amount input */}
              <div className="flex flex-col gap-1 px-4 pb-2 flex-grow">
                <label className="text-sm mb-1">Choose Plan</label>
                <Select value={stakePlan} onValueChange={setStakePlan}>
                  <SelectTrigger className="bg-[#232323] text-white rounded-xl px-4 py-2 border border-white min-h-[44px] w-full focus:ring-0 focus:border-[#aaa] hover:bg-[#23282a] hover:border-[#aaa] transition-colors">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#232323] text-white rounded-xl border border-white w-full">
                    <SelectItem value="THREE_MONTHS" className="hover:bg-[#33383a] !bg-[#232323] cursor-pointer transition-colors">3 Months (1%/mo)</SelectItem>
                    <SelectItem value="SIX_MONTHS" className="hover:bg-[#33383a] !bg-[#232323] cursor-pointer transition-colors">6 Months (1.5%/mo)</SelectItem>
                    <SelectItem value="TWELVE_MONTHS" className="hover:bg-[#33383a] !bg-[#232323] cursor-pointer transition-colors">12 Months (2%/mo)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-xs text-[#aaa] mt-1 mb-1">AIQ balance: <span className="font-bold text-white">{aiqBalance !== '' ? aiqBalance : '--'}</span></div>
                <label className="text-sm mt-2 mb-1">AIQ Amount</label>
                <Input
                  className="bg-[#222] text-white rounded-xl px-4 py-2 border border-white min-h-[44px] w-full focus:outline-none focus:ring-0 focus:border-white transition-all duration-150 placeholder-[#888] shadow-sm hover:border-[#888] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&[type=number]]:appearance-none"
                  type="number"
                  min="0"
                  value={stakeAmount}
                  onChange={e => setStakeAmount(e.target.value)}
                  placeholder="Enter AIQ amount"
                  inputMode="decimal"
                />
              </div>
              <div
                className="mt-auto flex flex-col items-center pb-1 mb-4"
                style={{ zIndex: 29 }}
              >
                <button
                  className="whitespace-nowrap border one h-[41px] w-[237px] bg-black mx-auto rounded-xl font-medium relative text-[16px]"
                  style={{
                    background:
                      "radial-gradient(circle at 85% -80%, rgba(255,255,255,0.3), transparent 30%)",
                    opacity: stakeLoading ? 0.6 : 1,
                    cursor: stakeLoading ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleStake}
                  disabled={!isConnected || stakeLoading}
                >
                  {stakeLoading
                    ? stakeStep === 'approving'
                      ? `Processing${dots}`
                      : stakeStep === 'confirming'
                      ? `Confirm in wallet${dots}`
                      : stakeStep === 'staking'
                      ? `Staking${dots}`
                      : `Processing${dots}`
                    : 'Stake'}
                </button>
              </div>
            </div>
            {/* Claim Rewards Card */}
            <div className="bg-[#141414] text-white rounded-2xl pt-4 max-w-[344px] w-full flex flex-col">
              <figure className="mb-4 flex justify-center flex-col items-center ">
                <div className="bg-[#1E1E1E] rounded-full m-auto w-[88px] h-[88px] flex items-center justify-center ">
                  <img src={claim} alt="" className="p-[17px] m-auto " />
                </div>
                <figcaption className="font-medium text-2xl mt-2">Claim Rewards</figcaption>
              </figure>
              {/* Plan selector for claim and reward display */}
              <div className="flex flex-col gap-1 px-4 pb-2 flex-grow">
                <label className="text-sm mb-1">Subscribed Plan</label>
                <Select value={claimPlan} onValueChange={setClaimPlan}>
                  <SelectTrigger className="bg-[#232323] text-white rounded-xl px-4 py-2 border border-white min-h-[44px] w-full focus:ring-0 focus:border-[#aaa] hover:bg-[#23282a] hover:border-[#aaa] transition-colors">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#232323] text-white rounded-xl border border-white w-full">
                    <SelectItem value="THREE_MONTHS" className="hover:bg-[#33383a] !bg-[#232323] cursor-pointer transition-colors">3 Months</SelectItem>
                    <SelectItem value="SIX_MONTHS" className="hover:bg-[#33383a] !bg-[#232323] cursor-pointer transition-colors">6 Months</SelectItem>
                    <SelectItem value="TWELVE_MONTHS" className="hover:bg-[#33383a] !bg-[#232323] cursor-pointer transition-colors">12 Months</SelectItem>
                  </SelectContent>
                </Select>
                {/* Rewards box (AIQ) */}
                <div className="mt-10 mb-1">
                  <div className="text-sm pb-1 text-white mb-1 text-left">Rewards</div>
                  <div className="rounded-xl bg-[#222] border border-[#333] text-center min-h-[44px] flex flex-col justify-center items-center px-4 py-2">
                    <div className="text-xs font-bold text-white mt-1">-- AIQ</div>
                  </div>
                </div>
              </div>
              <div
                className="mt-auto flex flex-col items-center pb-1 mb-4"
                style={{ zIndex: 29 }}
              >
                <button
                  className="whitespace-nowrap border one h-[41px] w-[237px] bg-black mx-auto rounded-xl font-medium relative text-[16px]"
                  style={{
                    background:
                      "radial-gradient(circle at 85% -80%, rgba(255,255,255,0.3), transparent 30%)",
                    opacity: claimLoading ? 0.6 : 1,
                    cursor: claimLoading ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleClaimRewards}
                  disabled={!isConnected || claimLoading}
                >
                  {claimLoading
                    ? claimStep === 'confirming'
                      ? `Confirm in wallet${dots}`
                      : claimStep === 'claiming'
                      ? `Claiming${dots}`
                      : `Processing${dots}`
                    : 'Claim'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
