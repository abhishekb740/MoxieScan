/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Send from "./Send";
import Success from "./Success";

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
  const [bid, setBid] = useState(false);

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-[95%] sm:w-[40%] my-6 mx-auto overflow-scroll">
          {/*content*/}
          <div className="border shadow-lg relative flex flex-col w-full bg-[#101010] border-[#262626] outline-none focus:outline-none rounded-xl overflow-scroll">
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
            {bid ? (
              <Success
                fanName={fanName}
                fanImage={fanImage}
                bidAmount={bidAmount}
              />
            ) : (
              <Send
                fanName={fanName}
                fanImage={fanImage}
                fanMoxieEarned={fanMoxieEarned}
                moxieBalance={moxieBalance}
                fanEarningsShared={fanEarningsShared}
                fanTokensAvailable={fanTokensAvailable}
                fanNumberOfBids={fanNumberOfBids}
                fanHighestBid={fanHighestBid}
                fanClearingPrice={fanClearingPrice}
                bidAmount={bidAmount}
                setBidAmount={setBidAmount}
                setBid={setBid}
              />
            )}
          </div>
        </div>
      </div>
      <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

export default Modal;
