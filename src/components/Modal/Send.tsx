import React, { useState } from "react";
import Farcaster from "@/icons/Farcaster";
import Moxie from "@/icons/Moxie";
import { formatWeiToEther } from "@/utils/helpers";

type SendProps = {
  auctionId: string;
  encodedOrderId: string;
  onBidHandler: (auctionId: string, encodedOrderId: string, _buyAmount: string, _sellAmount: string) => void;
  fanName: string;
  fanImage: string;
  bidAmount: number;
  setBidAmount: (bidAmount: number) => void;
  setBid: (bid: boolean) => void;
  moxieBalance: number;
  fanMoxieEarned: number;
  fanEarningsShared: number;
  fanTokensAvailable: string;
  fanNumberOfBids: number;
  fanHighestBid: number;
  fanClearingPrice: number;
  setPricePerFanToken: (pricePerFanToken: string) => void;
  pricePerFanToken: string;
};

const Send = ({
  auctionId,
  encodedOrderId,
  onBidHandler,
  pricePerFanToken,
  setPricePerFanToken,
  fanName,
  fanImage,
  bidAmount,
  setBidAmount,
  setBid,
  moxieBalance,
  fanMoxieEarned,
  fanEarningsShared,
  fanTokensAvailable,
  fanNumberOfBids,
  fanHighestBid,
  fanClearingPrice,
}: SendProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const bidHandler = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const receipt = await onBidHandler(
        auctionId,
        encodedOrderId,
        pricePerFanToken,
        bidAmount.toString()
      );

      if (typeof receipt !== 'undefined') {
        console.log("Transaction successful:", receipt);
        setBid(true);
      }
    } catch (error) {
      console.error("Transaction failed:", error);

      const errorMsg = (error as Error).message;
      let shortErrorMessage = "Transaction failed";

      if (errorMsg.includes("ACTION_REJECTED")) {
        shortErrorMessage = "Transaction rejected by user.";
      } else if (errorMsg.includes("insufficient funds")) {
        shortErrorMessage = "Insufficient funds for gas.";
      } else if (errorMsg.length > 100) {
        shortErrorMessage = "Unexpected error occurred. Please try again.";
      } else {
        shortErrorMessage = `Transaction failed: ${errorMsg}`;
      }

      setErrorMessage(shortErrorMessage);
      setBid(false);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="relative p-6 flex-auto flex flex-col items-start justify-start gap-6">
      {/* Fan Details */}
      <div className="flex items-center justify-start gap-3">
        <img src={fanImage} className="w-10 h-10 rounded-full" alt="fan" />
        <p className="text-white">{fanName}</p>
        <button className="cursor-pointer">
          <Farcaster />
        </button>
      </div>
      {/* Bid Details */}
      <div className="flex flex-col items-start justify-start w-full gap-2">
        <p className="text-white">Price per Fan Token in Moxie {'>'} 1</p>
        <div className="flex items-start justify-start border border-[#262626] bg-[#171717] rounded-xl w-full">
          <input
            type="text"
            className="bg-[#171717] text-[#737373] px-6 py-3 rounded-xl w-full outline-none"
            value={pricePerFanToken}
            onChange={(e) => setPricePerFanToken(e.target.value)}
            placeholder="0"
            min={1}
            defaultValue={1}
            disabled={isSubmitting}
          />
          <div className="px-6 py-3 ">
            <Moxie />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start w-full gap-2">
        <p className="text-white">What's your Total Budget?</p>
        <div className="flex items-start justify-start border border-[#262626] bg-[#171717] rounded-xl w-full">
          <input
            type="number"
            className="bg-[#171717] text-[#737373] px-6 py-3 rounded-xl w-full outline-none"
            value={bidAmount}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            placeholder="0"
            min={0}
            defaultValue={0}
            disabled={isSubmitting}
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
              disabled={isSubmitting}
            >
              Half
            </button>
            <button
              onClick={() => setBidAmount(moxieBalance)}
              className="cursor-pointer text-sm"
              disabled={isSubmitting}
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
            <p className="uppercase text-[#737373] text-sm">
              moxie earned all time
            </p>
            <p className="font-bold text-white text-2xl flex gap-4 items-center justify-center">
              {fanMoxieEarned.toFixed(2)} <Moxie />
            </p>
          </div>
          <div className="w-full flex items-center justify-between gap-4 py-2">
            <p className="uppercase text-[#737373] text-sm">earnings shared</p>
            <p className="text-[#32D583] text-sm flex gap-4 items-center justify-center">
              {fanEarningsShared}%
            </p>
          </div>
        </div>
        <div className="w-full flex flex-col items-start justify-start bg-[#0A0A0A] px-6 py-3 rounded-xl">
          <div className="w-full flex flex-col items-start justify-start gap-2 py-2 border-b border-b-[#262626]">
            <p className="uppercase text-[#737373] text-sm">
              fan tokens available
            </p>
            <p className="font-bold text-white text-2xl flex gap-4 items-center justify-center">
              {formatWeiToEther(fanTokensAvailable)}
            </p>
          </div>
          <div className="w-full flex items-center justify-between gap-4 py-2 font-bold">
            <p className="uppercase text-[#737373] text-sm">Number of bids</p>
            <p className="text-white text-sm flex gap-4 items-center justify-center">
              {fanNumberOfBids}
            </p>
          </div>
          <div className="w-full flex items-center justify-between gap-4 py-2 font-bold">
            <p className="uppercase text-[#737373] text-sm">Highest Bid</p>
            <p className="text-white text-sm flex gap-4 items-center justify-center">
              {fanHighestBid}
            </p>
          </div>
          <div className="w-full flex items-center justify-between gap-4 py-2 font-bold">
            <p className="uppercase text-[#737373] text-sm">Clearing Price</p>
            <p className="text-white text-sm flex gap-4 items-center justify-center">
              {fanClearingPrice.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm w-full text-center">
          {errorMessage}
        </div>
      )}

      <button
        onClick={bidHandler}
        className={`w-full py-3 rounded-full text-white ${isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-[#8658F6]"
          }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Bid"}
      </button>
    </div>
  );
};

export default Send;
