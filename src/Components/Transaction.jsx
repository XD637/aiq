import React from "react";
import AIQ_logo from "../assets/AIQ_logo.png";
import notepad from "../assets/notepad.svg";
import drop_down from "../assets/drop_down.svg";
import Navbar from "./Navbar";

const Transaction = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-t from-[#101010] to-[#2A2A2A] h-screen text-white  px-[102px]">
        <div className="pt-[67px]  ">
          <h1>Trasactions</h1>
          <p className="opacity-60 mt-[14px] ">
            {" "}
            View all your deposits, withdrawals, and staking activities in one
            place
          </p>
        </div>
        <section className="bg-gradient-to-l from-[#141414] to-[#0D0D0D] pt-[25px] mt-[32px] ps-[30px] rounded-[18px] mb-3  ">
          <div className=" flex  gap-4 ">
            <div className="opacity-60">
              <label htmlFor="" className="	block  mb-1 ps-2">
                Transaction Number{" "}
              </label>
              <input
                type="text"
                name=""
                id=""
                placeholder="Enter your transaction number"
                className="ps-3.5 py-1.5  w-[350px] placeholder:text[12px] border    rounded-sm border-opacity-25 "
              />
            </div>

            <div className="opacity-60">
              <label htmlFor="" className="	block  mb-1 ps-2">
                Type{" "}
              </label>

              <div className="relative">
                <select
                  name=""
                  id=""
                  className="ps-3.5 py-1.5 w-[189px] rounded-sm border pe-2   text-opacity-100 appearance-none "
                >
                  <option value="" className="bg-white">
                    Any
                  </option>
                </select>
                <img src={drop_down} alt="" className="drop_down" />
              </div>
            </div>
          </div>
          <div className="flex justify-center pb-[20px]">
            <button className="whitespace-nowrap border one two  h-[41px] w-[237px]  cursor-pointer  bg-black  rounded-xl font-medium  relative  text-[16px] mt-[26px]">
              stake
            </button>
          </div>
        </section>

        <section className="mb-[47px] bg-gradient-to-l from-[#141414] to-[#0D0D0D] h-[346px] rounded-[18px]  ">
          <div className=" opacity-60 margin flex justify-center items-center flex-col h-full ">
            <img src={notepad} alt="" className="h-[32px] w-[32px]" />
            <p>No transactions yet</p>
            <span className="text-xs ">
              Start staking or referring to see your activity here
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Transaction;
