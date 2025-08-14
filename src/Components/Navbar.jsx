import React from "react";
import AIQ_logo from "../assets/AIQ_logo.png";
import search_icon from "../assets/search_icon.png";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div>
      <div className="flex justify-between items-center bg-[#131313] px-[120px] py-[14px] text-white font-[Haas_Grot_Disp_Trial]">
        <div>
          {" "}
          <Link to='/'>
          <img src={AIQ_logo} alt="AiQ logo" />{" "}
          </Link>
        </div>

        <div>
          <a href="">products</a>
          <a href="" className="px-[40px]">
            Market
          </a>
          <a href="">$AIG</a>
        </div>

        <div className="flex items-center relative" style={{ zIndex: 20 }}>
          <div className="relative">
            <button className="whitespace-nowrap after-class btn mr-[32px] cursor-pointer border-white border font-medium bg-black rounded-xl py-2 px-7">
              connect wallet{" "}
            </button>
            <div className="main-shadow-demo"></div>
            <div className="sub-shadow-demo"></div>
          </div>
          <img src={search_icon} alt="" className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
