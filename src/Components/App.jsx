import React from 'react';
import { useAccount, useDisconnect, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import AIQ_logo from '../assets/AIQ_logo.png';
import search_icon from '../assets/search_icon.png';
import fff from '../assets/MintIcon.png';
import i_icon from '../assets/i_icon.svg';

function App() {
  // Mint states
  const [loading, setLoading] = React.useState(false);
  const [mintStep, setMintStep] = React.useState('idle'); // idle | approving | confirming | minting
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [stablecoin, setStablecoin] = React.useState('USDT');
  const [amount, setAmount] = React.useState('');

  // Staking states
  const [stakeAmount, setStakeAmount] = React.useState('');
  const [stakePlan, setStakePlan] = React.useState('THREE_MONTHS');
  const [stakeLoading, setStakeLoading] = React.useState(false);
  const [stakeStep, setStakeStep] = React.useState('idle'); // idle | approving | confirming | staking

  // Claim rewards states
  const [claimPlan, setClaimPlan] = React.useState('THREE_MONTHS');
  const [claimLoading, setClaimLoading] = React.useState(false);
  const [claimStep, setClaimStep] = React.useState('idle'); // idle | confirming | claiming

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
      alert('Please connect your wallet first.');
      return;
    }
    if (!window.ethereum) {
      alert('No wallet found!');
      return;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Enter a valid amount');
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
      alert('Mint successful!');
    } catch (err) {
      setLoading(false);
      setMintStep('idle');
      alert('Mint failed: ' + (err?.message || err));
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
      alert('Please connect your wallet first.');
      return;
    }
    if (!window.ethereum) {
      alert('No wallet found!');
      return;
    }
    if (!stakeAmount || isNaN(stakeAmount) || parseFloat(stakeAmount) <= 0) {
      alert('Enter a valid AIQ amount');
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
      alert('Stake successful!');
    } catch (err) {
      setStakeLoading(false);
      setStakeStep('idle');
      alert('Stake failed: ' + (err?.message || err));
    }
  };

  // Claim rewards handler
  const handleClaimRewards = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first.');
      return;
    }
    if (!window.ethereum) {
      alert('No wallet found!');
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
      alert('Claim successful!');
    } catch (err) {
      setClaimLoading(false);
      setClaimStep('idle');
      alert('Claim failed: ' + (err?.message || err));
    }
  };

  return (
    <div className="h-screen">
      <div className="flex justify-between items-center bg-[#131313] px-[120px] py-[14px] text-white font-[Haas_Grot_Disp_Trial]">
        <div>
          <img src={AIQ_logo} alt="AiQ logo" />
        </div>

        <div>
          <a href="">products</a>
          <a href="" className="px-[40px]">
            Market
          </a>
          <a href="">$AIG</a>
        </div>

        <div className="flex items-center relative" style={{ zIndex: 20 }}>
          <ConnectButton.Custom>
            {({ account, openConnectModal, mounted }) => {
              return (
                <button
                  className="whitespace-nowrap mr-[32px] border-white border font-medium bg-black rounded-xl py-2 px-7 shadows relative"
                  style={{
                    background:
                      "radial-gradient(circle at 85% -30%, rgba(255,255,255,0.3), transparent 30%)",
                  }}
                  onClick={account ? disconnect : openConnectModal}
                >
                  {account
                    ? `${account.displayName} (Disconnect)`
                    : 'connect wallet'}
                </button>
              );
            }}
          </ConnectButton.Custom>
          <div className="main-shadow"></div>
          <div className="sub-shadow"></div>
          <img src={search_icon} alt="" className="h-6 w-6" />
        </div>
      </div>

      <div className="bg-gradient-to-t from-[#101010] to-[#2A2A2A] h-screen ">
        <div className="text-white pt-[76px] mb-[45px] ">
          <h1 className="mb-[16px] text-center ">Stake More, Earn More</h1>
          <p className="text-[#F9F9F999]  text-center  font-gasp">
            Select from Silver, Golden, or Platinum plans and maximize your{" "}
            <br /> returns with flexible durations.
          </p>
        </div>

  <div className="flex justify-center gap-7 items-stretch">
          <div className="bg-[#141414] text-white rounded-2xl pt-[18px] max-w-[344px] w-full flex flex-col whitespace-nowrap">
            <figure className="mb-[32px] flex justify-center flex-col items-center ">
              <div className="bg-[#1E1E1E] rounded-full m-auto    w-[88px] h-[88px] flex items-center justify-center ">
                <img src={fff} alt="" className="  p-[17px] m-auto " />
              </div>
              <figcaption className="font-medium text-2xl mt-2">
                Minting
              </figcaption>
            </figure>

            {/* Stablecoin selector and amount input */}
            <div className="flex flex-col gap-2 px-6 pb-2 flex-grow">
              <label className="text-sm mb-1">Stablecoin</label>
              <select
                className="bg-[#232323] text-white rounded-xl px-4 py-2 border border-white focus:outline-none focus:ring-0 focus:border-white transition-all duration-200 appearance-none shadow-lg hover:border-[#aaa] hover:bg-[#262626] cursor-pointer min-h-[44px]"
                value={stablecoin}
                onChange={e => setStablecoin(e.target.value)}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M4 6l4 4 4-4\' stroke=\'white\' stroke-width=\'2\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  paddingRight: '2.5rem',
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
                }}
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
                <option value="DAI">DAI</option>
              </select>
              <label className="text-sm mt-2 mb-1">Amount</label>
              <input
                className="bg-[#222] text-white rounded-lg px-4 py-2 border border-white focus:outline-none focus:ring-0 focus:border-white transition-all duration-150 placeholder-[#888] shadow-sm hover:border-[#888]"
                type="number"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <div className="text-xs mt-2">You will receive: <span className="font-bold">{aiqAmount || '0'} AIQ</span></div>
            </div>
            <div
              className="mt-auto flex justify-center pb-1 mb-[21px]"
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
                    ? 'Processing...'
                    : mintStep === 'confirming'
                    ? 'Confirm in wallet...'
                    : mintStep === 'minting'
                    ? 'Minting...'
                    : 'Processing...'
                  : 'Mint'}
              </button>

            </div>
          </div>

          {/* Staking Card */}
          <div className="bg-[#141414] text-white rounded-2xl pt-[18px] max-w-[344px] w-full flex flex-col">
            <figure className="mb-[32px] flex justify-center flex-col items-center ">
              <div className="bg-[#1E1E1E] rounded-full m-auto w-[88px] h-[88px] flex items-center justify-center ">
                <img src={fff} alt="" className="p-[17px] m-auto " />
              </div>
              <figcaption className="font-medium text-2xl mt-2">Staking</figcaption>
            </figure>
            {/* Plan selector and amount input */}
            <div className="flex flex-col gap-2 px-6 pb-2 flex-grow">
              <label className="text-sm mb-1">Plan</label>
              <select
                className="bg-[#232323] text-white rounded-xl px-4 py-2 border border-white focus:outline-none focus:ring-0 focus:border-white transition-all duration-200 appearance-none shadow-lg hover:border-[#aaa] hover:bg-[#262626] cursor-pointer min-h-[44px]"
                value={stakePlan}
                onChange={e => setStakePlan(e.target.value)}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M4 6l4 4 4-4\' stroke=\'white\' stroke-width=\'2\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  paddingRight: '2.5rem',
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
                }}
              >
                <option value="THREE_MONTHS">3 Months (1%/mo)</option>
                <option value="SIX_MONTHS">6 Months (1.5%/mo)</option>
                <option value="TWELVE_MONTHS">12 Months (2%/mo)</option>
              </select>
              <label className="text-sm mt-2 mb-1">AIQ Amount</label>
              <input
                className="bg-[#222] text-white rounded-lg px-4 py-2 border border-white focus:outline-none focus:ring-0 focus:border-white transition-all duration-150 placeholder-[#888] shadow-sm hover:border-[#888]"
                type="number"
                min="0"
                value={stakeAmount}
                onChange={e => setStakeAmount(e.target.value)}
                placeholder="Enter AIQ amount"
              />
            </div>
            <div
              className="mt-auto flex flex-col items-center pb-1 mb-[21px]"
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
                    ? 'Processing...'
                    : stakeStep === 'confirming'
                    ? 'Confirm in wallet...'
                    : stakeStep === 'staking'
                    ? 'Staking...'
                    : 'Processing...'
                  : 'Stake'}
              </button>
            </div>
          </div>

          {/* Claim Rewards Card */}
          <div className="bg-[#141414] text-white rounded-2xl pt-[18px] max-w-[344px] w-full flex flex-col">
            <figure className="mb-[32px] flex justify-center flex-col items-center ">
              <div className="bg-[#1E1E1E] rounded-full m-auto w-[88px] h-[88px] flex items-center justify-center ">
                <img src={fff} alt="" className="p-[17px] m-auto " />
              </div>
              <figcaption className="font-medium text-2xl mt-2">Claim Rewards</figcaption>
            </figure>
            {/* Plan selector for claim */}
            <div className="flex flex-col gap-2 px-6 pb-2 flex-grow">
              <label className="text-sm mb-1">Plan</label>
              <select
                className="bg-[#232323] text-white rounded-xl px-4 py-2 border border-white focus:outline-none focus:ring-0 focus:border-white transition-all duration-200 appearance-none shadow-lg hover:border-[#aaa] hover:bg-[#262626] cursor-pointer min-h-[44px]"
                value={claimPlan}
                onChange={e => setClaimPlan(e.target.value)}
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M4 6l4 4 4-4\' stroke=\'white\' stroke-width=\'2\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.75rem center',
                  paddingRight: '2.5rem',
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
                }}
              >
                <option value="THREE_MONTHS">3 Months</option>
                <option value="SIX_MONTHS">6 Months</option>
                <option value="TWELVE_MONTHS">12 Months</option>
              </select>
            </div>
            <div
              className="mt-auto flex flex-col items-center pb-1 mb-[21px]"
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
                    ? 'Confirm in wallet...'
                    : claimStep === 'claiming'
                    ? 'Claiming...'
                    : 'Processing...'
                  : 'Claim'}
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

export default App;
