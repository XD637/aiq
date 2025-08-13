import React from "react";
import search_icon from "../assets/search_icon.png";
import AIQ_logo from "../assets/AIQ_logo.png";
import fff from "../assets/MintIcon.png";
import i_icon from "../assets/i_icon.svg";

const Transaction = () => {
  return (
    <div>
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
                <button
                  className="whitespace-nowrap mr-[32px] border-white border font-medium bg-black rounded-xl py-2 px-7 shadows relative"
                  style={{
                    background:
                      "radial-gradient(circle at 85% -30%, rgba(255,255,255,0.3), transparent 30%)",
                  }}
                >
                  connect wallet{" "}
                </button>
                <div className="main-shadow"></div>
                <div className="sub-shadow"></div>
                <img src={search_icon} alt="" className="h-6 w-6" />
              </div>
            </div>



      <div className="bg-gradient-to-t from-[#101010] to-[#2A2A2A] h-screen text-white  pl-[102px]" >
        <div className="pt-[67px]  ">
          <h1>Trasactions</h1>
          <p className="opacity-60 mt-[14px] ">
            {" "}
            View all your deposits, withdrawals, and staking activities in one
            place
          </p>
        </div>


        <div className="mt-[32px] ">
          <div>
            <label htmlFor="">Transaction Number </label>
            <input type="text" name="" id="" placeholder="Enter your transaction number" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
