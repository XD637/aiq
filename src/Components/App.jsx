import "../App.css";
import search_icon from "../assets/search_icon.png";
import AIQ_logo from "../assets/AIQ_logo.png";
import fff from "../assets/MintIcon.png";
import i_icon from "../assets/i_icon.svg";
import { Link } from "react-router-dom";
function App() {
  return (
    <div className="h-screen">
      <div className="flex justify-between items-center bg-[#131313] px-[120px] py-[14px] text-white font-[Haas_Grot_Disp_Trial]">
        <div>
          <Link to="/">
            <img src={AIQ_logo} alt="AiQ logo" />
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
                className="whitespace-nowrap border one two h-[41px] w-[237px]  bg-black mx-auto rounded-xl font-medium  relative  text-[16px] "
                
              >
                Mint
              </button>
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
                className="whitespace-nowrap border one two h-[41px] w-[237px]  bg-black mx-auto rounded-xl font-medium  relative  text-[16px] "
                // style={{
                //   background:
                //     "radial-gradient(circle at 85% -80%, rgba(255,255,255,0.3), transparent 30%)",
                // }}
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
                className="whitespace-nowrap border one two h-[41px] w-[237px]  bg-black mx-auto rounded-xl font-medium  relative  text-[16px] "
                // style={{
                //   background:
                //     "radial-gradient(circle at 85% -80%, rgba(255,255,255,0.3), transparent 30%)",
                // }}
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
