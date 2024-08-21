/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import Send from "./Send";
import Success from "./Success";
import { fetchCertainAuctionDetails, fetchUsersLifetimeMoxieEarned, fetchClearingPriceForAFanToken, fetchAuctionOrders } from "@/app/_actions/queries";
import { useEffect } from "react";

type ModalProps = {
  onBidHandler: (auctionId: string, encodedOrderId: string, _buyAmount: string, _sellAmount: string) => void;
  fanName: string;
  fanImage: string;
  fanFc: string;
  fanMoxieEarned: number;
  moxieBalance: number;
  fanEarningsShared: number;
  fanTokensAvailable: number;
  fanNumberOfBids: number;
  fanHighestBid: number;
  setShowModal: (showModal: boolean) => void;
  currentBid: Bid | null;
};

const Modal = ({
  onBidHandler,
  moxieBalance,
  fanEarningsShared,
  fanNumberOfBids,
  fanHighestBid,
  setShowModal,
  currentBid
}: ModalProps) => {
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bid, setBid] = useState<boolean>(false);
  const [pricePerFanToken, setPricePerFanToken] = useState<string>('');
  const [FTDetails, setFTDetails] = useState<AuctionDetailsResponse | null>(null);
  const [clearingPriceDetails, setClearingPriceDetails] = useState<ClearingPriceResponse | null>(null);
  const [lifetimeMoxieEarned, setLifetimeMoxieEarned] = useState<number>(0);
  const [encodedOrderId, setEncodedOrderId] = useState<string>('');
  console.log(currentBid?.auctionId)
  useEffect(() => {
    const fetchDetails = async (auctionId: string) => {
      const auctionOrders = await fetchAuctionOrders(auctionId, currentBid?.price ?? '0');
      if(auctionOrders?.length > 0) {
        setEncodedOrderId(auctionOrders[0].encodedOrderId);
      }
      else{
        setEncodedOrderId('0x0000000000000000000000000000000000000000000000000000000000000001');
      }
      const auctionDetails = await fetchCertainAuctionDetails(auctionId);
      setFTDetails(auctionDetails);
      const clearingPrice = await fetchClearingPriceForAFanToken(auctionId);
      setClearingPriceDetails(clearingPrice);
      const lifetimeMoxieEarned = await fetchUsersLifetimeMoxieEarned((currentBid?.isFid ? currentBid?.FTfid : currentBid?.channelId) ?? '', currentBid?.isFid ?? false);
      setLifetimeMoxieEarned(lifetimeMoxieEarned ?? 0);
    }
    fetchDetails(currentBid?.auctionId ?? '');
  }, [])

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-[95%] sm:w-[40%] my-6 mx-auto">
          {/*content*/}
          <div className="border shadow-lg relative flex flex-col w-full bg-[#101010] border-[#262626] outline-none focus:outline-none rounded-xl">
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
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            {/*body*/}
            {bid ? (
              <Success
                fanName={currentBid?.tokenProfileName ?? ''}
                fanImage={currentBid?.tokenProfileImage ?? ''}
                bidAmount={bidAmount}
              />
            ) : (
              <Send
                auctionId={currentBid?.auctionId ?? ''}
                encodedOrderId={encodedOrderId}
                onBidHandler={onBidHandler}
                pricePerFanToken={pricePerFanToken}
                setPricePerFanToken={setPricePerFanToken}
                fanName={currentBid?.tokenProfileName ?? ''}
                fanImage={currentBid?.tokenProfileImage ?? ''}
                fanMoxieEarned={lifetimeMoxieEarned}
                moxieBalance={moxieBalance}
                fanEarningsShared={fanEarningsShared}
                fanTokensAvailable={FTDetails?.auctionDetails[0].minBuyAmount ?? '0'}
                fanNumberOfBids={fanNumberOfBids}
                fanHighestBid={fanHighestBid}
                fanClearingPrice={clearingPriceDetails?.auction.clearingPrice ?? 0}
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
