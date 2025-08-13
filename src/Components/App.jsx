import React from 'react';
import { useAccount, useDisconnect, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import AIQ_logo from '../assets/AIQ_logo.png';
import search_icon from '../assets/search_icon.png';
import fff from '../assets/MintIcon.png';
import i_icon from '../assets/i_icon.svg';

function App() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const [stablecoin, setStablecoin] = React.useState('USDT');
  const [amount, setAmount] = React.useState('');

  // Stablecoin addresses and decimals
  const stablecoins = {
    USDT: { address: '0x0938E316F1B7F517F6CeaAf9fE4D4b25266b8D2C', decimals: 6 },
    USDC: { address: '0xc247beDaF2745A22A93a7A2Da41457FcBdEf686b', decimals: 6 },
    DAI:  { address: '0x06FF24582aaAb1521A5dbBFfc9b16C870FB56Afa', decimals: 6 },
  };
  const mintingAddress = '0x25F9435F4439DD798C71fB202174a05fa4D8d3b5';
  const mintingAbi = ["function exchange(address stablecoin, uint256 stablecoinAmount) external"];
  const erc20Abi = ["function approve(address spender, uint256 amount) external returns (bool)"];

  // Calculate AIQ to receive
  let aiqAmount = '';
  if (amount && !isNaN(amount)) {
    aiqAmount = (parseFloat(amount) / 100).toString();
  }
  const handleMint = async () => {
    setError('');
    if (!window.ethereum) {
      setError('No wallet found!');
      return;
    }
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      const token = stablecoins[stablecoin];
      const parsedAmount = ethers.parseUnits(amount, token.decimals);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // Approve selected stablecoin for minting contract (wait for confirmation before proceeding)
      const tokenContract = new ethers.Contract(token.address, erc20Abi, signer);
      const approveTx = await tokenContract.approve(mintingAddress, parsedAmount);
      await approveTx.wait();
      // After approval, call minting contract
      const minting = new ethers.Contract(mintingAddress, mintingAbi, signer);
      const tx = await minting.exchange(token.address, parsedAmount);
      await tx.wait();
      setLoading(false);
      setError('');
      alert('Mint successful!');
    } catch (err) {
      setLoading(false);
      setError('Mint failed: ' + (err?.message || err));
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

        <div className="flex  justify-center gap-7 ">
          <div className="bg-[#141414] text-white rounded-2xl pt-[18px] max-w-[344px] w-full  whitespace-nowrap  ">
            <figure className="mb-[32px] flex justify-center flex-col items-center ">
              <div className="bg-[#1E1E1E] rounded-full m-auto    w-[88px] h-[88px] flex items-center justify-center ">
                <img src={fff} alt="" className="  p-[17px] m-auto " />
              </div>
              <figcaption className="font-medium text-2xl mt-2">
                Minting
              </figcaption>
            </figure>

            {/* Stablecoin selector and amount input */}
            <div className="flex flex-col gap-2 px-6 pb-2">
              <label className="text-sm mb-1">Stablecoin</label>
              <select
                className="bg-[#222] text-white rounded px-2 py-1"
                value={stablecoin}
                onChange={e => setStablecoin(e.target.value)}
              >
                <option value="USDT">USDT</option>
                <option value="USDC">USDC</option>
                <option value="DAI">DAI</option>
              </select>
              <label className="text-sm mt-2 mb-1">Amount</label>
              <input
                className="bg-[#222] text-white rounded px-2 py-1"
                type="number"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
              <div className="text-xs mt-2">You will receive: <span className="font-bold">{aiqAmount || '0'} AIQ</span></div>
            </div>
            <div
              className="mt-[32px] flex justify-center pb-1 mb-[21px]  "
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
                {loading ? 'Processing...' : 'Mint'}
              </button>
              {error && (
                <div className="text-red-400 text-xs mt-2 text-center w-full break-words">{error}</div>
              )}
            </div>
          </div>

          <div className="bg-[#141414] text-white rounded-2xl pt-[18px] max-w-[344px] w-full  ">
            <figure className="mb-[32px] flex justify-center flex-col items-center ">
              <div className="bg-[#1E1E1E] rounded-full m-auto    w-[88px] h-[88px] flex items-center justify-center ">
                <img src={fff} alt="" className="  p-[17px] m-auto " />
              </div>
              <figcaption className="font-medium text-2xl mt-2">
                Staking
              </figcaption>
            </figure>

            <div className="flex justify-between pl-[33px] pr-[49px] ">
              <span className="">USDT Balance:</span>
              <p>100</p>
            </div>

            <div className=" bg-[#191919]  mx-[18px] mt-[12px] rounded-[5px]  pl-[14px] pr-[26px]">
              <div className="flex justify-between gap-0.5 border-b border-b-[#FFFFFF40]  py-[9px] ">
                <span className="flex justify-center items-center ">
                  APO{" "}
                  <img
                    src={i_icon}
                    alt="i icon "
                    className="w-[12px] h-3 ml-1"
                  />
                </span>
                <p>01%</p>
              </div>

              <div className="flex  justify-between border-b border-b-[#FFFFFF40]  py-[9px] ">
                <span className="">Ends on</span>
                <p>20 Aug 2026</p>
              </div>

              <div className="flex  justify-between   py-[8px] ">
                <span className="">Daily rewards</span>
                <p>1,254.8 1 INCH</p>
              </div>
            </div>

            <div
              className="mt-[32px] flex justify-center pb-1 mb-[21px]  "
              style={{ zIndex: 29 }}
            >
              <button
                className="whitespace-nowrap border one h-[41px] w-[237px]  bg-black mx-auto rounded-xl font-medium  relative  text-[16px] "
                style={{
                  background:
                    "radial-gradient(circle at 85% -80%, rgba(255,255,255,0.3), transparent 30%)",
                }}
              >
                Mint
              </button>
            </div>
          </div>

          <div className="bg-[#141414] text-white rounded-2xl pt-[18px] max-w-[344px] w-full   whitespace-nowrap ">
            <figure className="mb-[32px] flex justify-center flex-col items-center ">
              <div className="bg-[#1E1E1E] rounded-full m-auto    w-[88px] h-[88px] flex items-center justify-center ">
                <img src={fff} alt="" className="  p-[17px] m-auto " />
              </div>
              <figcaption className="font-medium text-2xl mt-2">
                Minting
              </figcaption>
            </figure>

            <div className="flex justify-between pl-[33px] pr-[49px] ">
              <span className="">USDT Balance:</span>
              <p>100</p>
            </div>

            <div className=" bg-[#191919]  mx-[18px] mt-[12px] rounded-[5px]  pl-[14px] pr-[26px]">
              <div className="flex justify-between gap-0.5 border-b border-b-[#FFFFFF40]  py-[9px] ">
                <span className="flex justify-center items-center ">
                  APO{" "}
                  <img
                    src={i_icon}
                    alt="i icon "
                    className="w-[12px] h-3 ml-1"
                  />
                </span>
                <p>01%</p>
              </div>

              <div className="flex  justify-between border-b border-b-[#FFFFFF40]  py-[9px] ">
                <span className="">Ends on</span>
                <p>20 Aug 2026</p>
              </div>

              <div className="flex  justify-between   py-[8px] ">
                <span className="">Daily rewards</span>
                <p>1,254.8 1 INCH</p>
              </div>
            </div>

            <div
              className="mt-[32px] flex justify-center pb-1 mb-[21px]  "
              style={{ zIndex: 29 }}
            >
              <button
                className="whitespace-nowrap border one h-[41px] w-[237px]  bg-black mx-auto rounded-xl font-medium  relative  text-[16px] "
                style={{
                  background:
                    "radial-gradient(circle at 85% -80%, rgba(255,255,255,0.3), transparent 30%)",
                }}
              >
                Mint
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
