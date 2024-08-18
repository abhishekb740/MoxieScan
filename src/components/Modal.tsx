/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Farcaster from "@/icons/Farcaster";
import Moxie from "@/icons/Moxie";

type ModalProps = {
  fanName: string;
  fanImage: string;
  fanFc: string;
  fanMoxieEarned: number;
  moxieBalance: number;
  fanEarningsShared: number;
  fanTokensAvailable: number;
  fanNumberOfBids: number;
  fanHighestBid: number;
  fanClearingPrice: number;
  setShowModal: (showModal: boolean) => void;
};

const Modal = ({
  fanName,
  fanImage,
  fanFc,
  fanMoxieEarned,
  moxieBalance,
  fanEarningsShared,
  fanTokensAvailable,
  fanNumberOfBids,
  fanHighestBid,
  fanClearingPrice,
  setShowModal,
}: ModalProps) => {
  const [bidAmount, setBidAmount] = useState(0);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-[95%] sm:w-[40%] my-6 mx-auto overflow-scroll">
          {/*content*/}
          <div className="border shadow-lg relative flex flex-col w-full bg-[#1c1b1b] border-[#262626] outline-none focus:outline-none rounded-xl overflow-scroll">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-[#262626] rounded-t">
              <h3 className="text-md text-[#737373] font-semibold uppercase ">
                Bid on a fan token
              </h3>
              <button
                className="p-1 ml-auto bg-transparent border-0 text-white opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowModal(false)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 20L4 4M20 4L4 20"
                    stroke="#FFFFFF"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            </div>
            {/*body*/}
            <div className="relative p-6 flex-auto flex flex-col items-start justify-start gap-6">
              {/* Fan Details */}
              <div className="flex items-center justify-start gap-3">
                <img
                  src={fanImage}
                  className="w-10 h-10 rounded-full"
                  alt="fan"
                />
                <p className="text-white">{fanName}</p>
                <button className="cursor-pointer">
                  <Farcaster />
                </button>
              </div>
              {/* Bid Details */}
              <div className="flex flex-col items-start justify-start w-full gap-2">
                <p className="text-white">Enter Bid Amount</p>
                <div className="flex items-start justify-start border border-[#262626] bg-[#171717] rounded-xl w-full">
                  <input
                    type="number"
                    className="bg-[#171717] text-[#737373] px-6 py-3 rounded-xl w-full outline-none"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    placeholder="0.0"
                  />
                  <div className="px-6 py-3 ">
                    <Moxie />
                  </div>
                </div>
                <div className="flex items-center justify-between w-full text-[#737373]">
                  <p className="text-sm">Available: {moxieBalance}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setBidAmount(moxieBalance / 2)}
                      className="cursor-pointer text-sm"
                    >
                      Half
                    </button>
                    <button
                      onClick={() => setBidAmount(moxieBalance)}
                      className="cursor-pointer text-sm"
                    >
                      Max
                    </button>
                  </div>
                </div>
              </div>
              {/* About Fan Token */}
              <div className="flex flex-col gap-4 items-start justify-start w-full">
                <p className="text-sm">About {fanName}&apos;s fan token</p>
                {/* Moxie value */}
                <div className="w-full flex flex-col items-start justify-start bg-[#0A0A0A] px-6 py-3 rounded-xl">
                    <div className="w-full flex flex-col items-start justify-start gap-2 py-2 border-b border-b-[#262626]">
                        <p className="uppercase text-[#737373] text-sm">moxie earned all time</p>
                        <p className="font-bold text-white text-2xl flex gap-4 items-center justify-center">{fanMoxieEarned} <Moxie /></p>
                    </div>
                    <div className="w-full flex items-center justify-between gap-4 py-2">
                        <p className="uppercase text-[#737373] text-sm">earnings shared</p>
                        <p className="text-[#32D583] text-sm flex gap-4 items-center justify-center">{fanEarningsShared}%</p>
                    </div>
                </div>
                <div className="w-full flex flex-col items-start justify-start bg-[#0A0A0A] px-6 py-3 rounded-xl">
                    <div className="w-full flex flex-col items-start justify-start gap-2 py-2 border-b border-b-[#262626]">
                        <p className="uppercase text-[#737373] text-sm">fan tokens available</p>
                        <p className="font-bold text-white text-2xl flex gap-4 items-center justify-center">{fanTokensAvailable}</p>
                    </div>
                    <div className="w-full flex items-center justify-between gap-4 py-2 font-bold">
                        <p className="uppercase text-[#737373] text-sm">Number of bids</p>
                        <p className="text-white text-sm flex gap-4 items-center justify-center">{fanNumberOfBids}</p>
                    </div>
                    <div className="w-full flex items-center justify-between gap-4 py-2 font-bold">
                        <p className="uppercase text-[#737373] text-sm">Highest Bid</p>
                        <p className="text-white text-sm flex gap-4 items-center justify-center">{fanHighestBid}</p>
                    </div>
                    <div className="w-full flex items-center justify-between gap-4 py-2 font-bold">
                        <p className="uppercase text-[#737373] text-sm">Clearing Price</p>
                        <p className="text-white text-sm flex gap-4 items-center justify-center">{fanClearingPrice}</p>
                    </div>
                </div>
              </div>

              <button className="w-full bg-[#8658F6] text-white py-3 rounded-xl">
                Bid
            </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Modal;
