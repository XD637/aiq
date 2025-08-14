import React from "react";
import Navbar from "./Navbar";
import use from "../assets/use.svg";
import arrow_side from "../assets/arrow_side.svg";
import i_icon from "../assets/i_icon.svg";
import notepad from "../assets/notepad.svg";
import cross from "../assets/Cross.svg";
import cripto from '../assets/cripto.png'

const Overview = () => {
  return (
    <div>
      <Navbar />

      <div className="bg-gradient-to-t from-[#101010] to-[#2A2A2A] h-screen text-white  px-[102px]">
        <div className="pt-[67px]  ">
          <h1>Your Financial Overview</h1>
          <p className="opacity-60 mt-[14px] ">
            {" "}
            Track your activity, deposit funds, and boost earnings through
            referrals
          </p>
        </div>

        <section className="mt-[32px]  flex justify-center  gap-[22px] ">
          <div className="pl-[22px] pr-[20px] w-[391px] bg-linear-to-t from-[#141414] to-[#0D0D0D] rounded-xl  pt-[18px] pb-[23px]">
            <div className="flex justify-between mb-[26px] w-full">
              <div className="bg-[#1E1E1E] rounded-full m-auto mx-0    w-[44px] h-[41px] flex items-center justify-center">
                <img src={use} alt="" className="mx-0" />
              </div>
              <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full border-2 border-dashed border-white">
                <img src={arrow_side} alt="" />
              </div>
            </div>

            <p className="opacity-60">Total Deposit </p>
            <strong className="text-[40px]  ">$0.00</strong>
          </div>

          <div className="pl-[22px] pr-[20px] w-[391px] bg-linear-to-t from-[#141414] to-[#0D0D0D] rounded-xl  pt-[18px] pb-[23px]">
            <div className="flex justify-between mb-[26px] w-full">
              <div className="bg-[#1E1E1E] rounded-full m-auto mx-0    w-[44px] h-[41px] flex items-center justify-center">
                <img src={use} alt="" className="mx-0" />
              </div>
              <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full border-2 border-dashed border-white">
                <img src={arrow_side} alt="" />
              </div>
            </div>

            <p className="opacity-60">Total Deposit </p>
            <strong className="text-[40px]  ">$0.00</strong>
          </div>

          <div className="pl-[22px] pr-[20px] w-[391px] bg-linear-to-t from-[#141414] to-[#0D0D0D] rounded-xl  pt-[18px] pb-[23px]">
            <div className="flex justify-between mb-[26px] w-full">
              <div className="bg-[#1E1E1E] rounded-full m-auto mx-0    w-[44px] h-[41px] flex items-center justify-center">
                <img src={use} alt="" className="mx-0" />
              </div>
              <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full border-2 border-dashed border-white">
                <img src={arrow_side} alt="" />
              </div>
            </div>

            <p className="opacity-60">Total Deposit </p>
            <strong className="text-[40px]  ">$0.00</strong>
          </div>
        </section>

        <div className="opacity-60 flex items-center  mt-[8px] mb-[18px] ">
          <img src={i_icon} alt="" className="h-[18px] w-[18px]  " />
          <p className="ms-1">
            If you want to get push notification then you have to allow
            notification from your browser
          </p>
        </div>

        <section className="mb-[47px] bg-gradient-to-l from-[#141414] to-[#0D0D0D] h-[346px] rounded-[18px]  ">
          <div className=" opacity-60 margin flex justify-center items-center flex-col h-full ">
            <img src={notepad} alt="" className="h-[32px] w-[32px]" />
            <p>No transactions yet</p>
            <span className="text-xs ">
              Start staking or referring to see your activity here
            </span>
          </div>
        </section>

        {/* <div className="py-[25px] px-[30px] bg-[#121212] w-[395px] h-[239px] rounded-xl">
          <div className="flex pb-[32px] justify-between ">
            <div>
              <h2 className="text-[24px]">Connect Your Wallet</h2>
              <p className="opacity-60">
                Securely link your Metamask to start <br /> managing assets
              </p>
            </div>
            <div className="border rounded-lg h-[25px] w-[25px] flex mt-2 ">
              <img src={cross} alt="" className="p-[6px] " />
            </div>
          </div>

          <div>
            <p className="opacity-60 mb-3">Wallet</p>
             <div className="bg-[#212121] rounded-2xl w-[331px] h-[56px] px-[20px] py-[12px] ">
               <div className="flex justify-between items-center"> <p>Metamask</p>
                <img src={cripto} alt="" /></div>

             </div>
          </div>
        </div> */}


        
      </div>
    </div>
  );
};

export default Overview;
