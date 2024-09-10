import React from "react";
import Farcaster from "@/icons/Farcaster";
import Moxie from "@/icons/Moxie";
import SuccessIcon from '@/icons/Success'

type SuccessProps = {
  fanName: string;
  fanImage: string;
  bidAmount: number;
};

const Success = ({ fanName, fanImage, bidAmount }: SuccessProps) => {
  return (
    <div className="relative p-6 flex-auto flex flex-col items-center justify-start gap-6">
        <SuccessIcon />
      {/* Fan Details */}
      
      <div className="flex items-center justify-start gap-3">
        <p className="text-white text-xl font-bold">You have successfully bid </p>
      </div>

      <div className="flex flex-row items-center justify-start text-xl">
        <p className="text-white text-xl font-bold mb-0">{bidAmount} MOXIE for</p>
        <img src={fanImage} className="w-10 h-10 rounded-full" alt="fan" />
        <p className="text-white text-xl font-bold">{fanName}</p>
        <button className="cursor-pointer">
          <Farcaster />
        </button>
      </div>

      <div className="flex items-center justify-center gap-6 w-full">
        <button className="w-full bg-[#8658F6] text-white py-3 rounded-full">
          Bid More
        </button>
        <button className="w-full bg-[#262626] text-white py-3 rounded-full">
          View More Auctions
        </button>
      </div>
    </div>
  );
};

export default Success;
