/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Paginate from "./pagination/Paginate";
import Farcaster from "@/icons/Farcaster"
import { formatNumber } from "@/utils/helpers"
import { fetchAuctionsWithBids, fetchUserBids, fetchLiveAuctionFT } from "@/app/_actions/queries";
import BaseABIAndAddress from "@/deployments/base/EasyAuction.json";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import Modal from "./Modal/Modal";
import { useAccount } from 'wagmi';
import { config } from "@/app/wagmi";
import { useConnectModal } from '@rainbow-me/rainbowkit';

const PAGE_SIZE = 9;

type HeroProps = {
    price: number;
    initialBids: Bid[];
    totalBids: number;
    activeFT: FarcasterFanTokenAuctionsResponse;
};

const Hero = ({ price, initialBids, totalBids, activeFT }: HeroProps) => {
    const [bids, setBids] = useState<Bid[]>(initialBids);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [userBids, setUserBids] = useState<User[]>([]);
    const [newBids, setNewBids] = useState<Bid[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [currentBid, setCurrentBid] = useState<Bid | null>(null);

    const account = useAccount({
        config,
    })
    const { openConnectModal } = useConnectModal();

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const updatedBids = await fetchAuctionsWithBids();
                const newBids = updatedBids.filter((bid) => !bids.some((b) => b.encodedOrderId === bid.encodedOrderId));
                setNewBids(newBids);
                setBids(updatedBids);
                const getUserBids = async () => {
                    if (account.address) {
                        try {
                            const userBids = await fetchUserBids(account.address);
                            if (userBids.length > 0) {
                                setUserBids(userBids);
                            }
                        } catch (e) {
                            console.error("Failed to fetch user bids:", e);
                        }
                    }
                };
                getUserBids();
            } catch (error) {
                console.error("Failed to fetch bids:", error);
            }
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const onBidHandler = async (
        auctionId: string,
        encodedOrderId: string,
        _buyAmount: string,
        _sellAmount: string
    ): Promise<ethers.providers.TransactionReceipt | undefined> => {
        if (!account.isConnected) {
            if (openConnectModal) {
                openConnectModal();
            }
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum!);
            const signer = provider.getSigner();
            const auctionContract = new ethers.Contract(BaseABIAndAddress.address, BaseABIAndAddress.abi, signer);
            const biddingTokenAddress = "0x8C9037D1Ef5c6D1f6816278C7AAF5491d24CD527";
            const biddingTokenContract = new ethers.Contract(
                biddingTokenAddress,
                ["function approve(address spender, uint256 amount) external returns (bool)"],
                signer
            );

            const buyAmount = ethers.utils.parseUnits(_buyAmount, 18);
            const sellAmount = ethers.utils.parseUnits(_sellAmount, 18);

            const approveTx = await biddingTokenContract.approve(BaseABIAndAddress.address, sellAmount);
            await approveTx.wait();
            console.log('Approval successful:', approveTx);

            const tx = await auctionContract.populateTransaction.placeSellOrders(
                auctionId,
                [buyAmount],
                [sellAmount],
                [encodedOrderId],
                '0x'
            );

            const response = await signer.sendTransaction(tx);
            const receipt = await response.wait();

            if (receipt.status === 0) {
                throw new Error("Transaction failed");
            }

            console.log('Transaction successful:', receipt);
            return receipt;

        } catch (error) {
            console.error("Failed to bid on a fan token:", error);
            throw error;
        }
    };



    const onCancelBidHandler = async (auctionId: string, encodedOrderId: string) => {
        if (!account.isConnected) {
            if (openConnectModal) {
                openConnectModal();
            }
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum!);
            const signer = provider.getSigner();
            const auctionContract = new ethers.Contract(BaseABIAndAddress.address, BaseABIAndAddress.abi, signer);
            const tx = await auctionContract.populateTransaction.cancelSellOrders(auctionId, [encodedOrderId]);
            const response = await signer.sendTransaction(tx);
            const receipt = await response.wait();
            console.log('Transaction successful:', receipt);
        } catch (error) {
            console.error("Failed to cancel bid:", error);
        }
    };

    const formatRelativeTime = (timestamp: number) => {
        return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
    };

    const paginatedBids = bids.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const hasUserAlreadyBid = (auctionId: string) => {
        return userBids.some((userBid) =>
            userBid.orders.some(
                (order) =>
                    order.auctionId === auctionId
            )
        );
    };

    const isAFTAuctionActive = (auctionId: string) => {
        if (!activeFT || !activeFT.FarcasterFanTokenAuctions || !activeFT.FarcasterFanTokenAuctions.FarcasterFanTokenAuction) {
            return false;
        }
        const activeAuctionIds = activeFT.FarcasterFanTokenAuctions.FarcasterFanTokenAuction.map(
            auction => auction.auctionId
        );
        for (let i = 0; i < activeAuctionIds.length; i++) {
            if (activeAuctionIds[i] == auctionId) {
                return true;
            }
        }
    };


    let testModalProps = {
        fanName: "Jesse Pollock",
        fanImage: "https://wrpcd.net/cdn-cgi/imagedelivery/BXluQx4ige9GuW0Ia56BHw/1013b0f6-1bf4-4f4e-15fb-34be06fede00/anim=false,fit=contain,f=auto,w=336",
        fanFc: "0x123456789",
        fanMoxieEarned: 76749.435,
        moxieBalance: 5000,
        fanEarningsShared: 50,
        fanTokensAvailable: 42535,
        fanNumberOfBids: 5,
        fanHighestBid: 100,
        setShowModal: setShowModal
    }

    const ModalOpenHandler = (bid: Bid) => {
        setShowModal(true);
        setCurrentBid(bid);
    };

    return (
        <div className="px-4 md:px-20 font-rubik">
            {
                showModal && <Modal currentBid={currentBid} {...testModalProps} onBidHandler={onBidHandler} />
            }
            <div className="overflow-x-auto">
                <table className="min-w-full bg-black text-white">
                    <thead className="py-4 border-b border-[#CBD5E11F] border-opacity-10">
                        <tr className="text-md">
                            <th className="px-6 py-3 text-white tracking-wider text-left" style={{ borderTopLeftRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' }}>User</th>
                            <th className="px-6 py-3 text-white tracking-wider text-left">Token</th>
                            <th className="px-6 py-3 text-white tracking-wider text-left">Bid</th>
                            <th className="px-6 py-3 text-white tracking-wider text-left" style={{ borderTopRightRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}></th>
                            <th className="px-6 py-3 text-white tracking-wider text-left"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-black">
                        {paginatedBids.map((bid, i) => {
                            const isNewBid = newBids.some(newBid => newBid.encodedOrderId === bid.encodedOrderId);

                            const userHasAlreadyBid = hasUserAlreadyBid(
                                bid.auctionId ?? ""
                            );
                            const isActiveFT = isAFTAuctionActive(bid.auctionId ?? "");
                            return (
                                <motion.tr
                                    key={i}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 350, damping: 40 }}
                                    className={isNewBid ? "animated-list-item" : ""}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap flex flex-row gap-2 items-center">
                                        {bid.profileName ? (
                                            <Link target="_blank" className="flex flex-row gap-2 items-center" href={`https://warpcast.com/${bid.profileName}`}>
                                                <div className="flex-shrink-0">
                                                    {bid.profileImage ? (
                                                        <img className="w-8 h-8 rounded-full" src={bid.profileImage ?? ''} alt="profile Image" />
                                                    ) : (
                                                        <div className="bg-gradient-to-b from-violet-500 to-blue-600 w-8 h-8 rounded-full shadow-lg"></div>
                                                    )}
                                                </div>
                                                {bid.profileName}
                                                <Farcaster />
                                            </Link>
                                        ) : (
                                            <div className="flex flex-row gap-2 items-center">
                                                <div>
                                                    {bid.profileImage ? (
                                                        <img className="w-8 h-8 rounded-full" src={bid.profileImage ?? ''} alt="profile Image" />
                                                    ) : (
                                                        <div className="bg-gradient-to-b from-violet-500 to-blue-600 w-8 h-8 rounded-full shadow-lg"></div>
                                                    )}
                                                </div>
                                                {bid.user.address.slice(0, 5) + "..." + bid.user.address.slice(bid.user.address.length - 4, bid.user.address.length)}
                                                <Farcaster />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-row items-center justify-start gap-2">
                                            <div className="text-[#F7BF6A] font-bold">bids on</div>
                                            <Link className="flex flex-row gap-2 items-center" target="_black" href={bid.isFid ? `https://warpcast.com/${bid.tokenProfileName}` : `https://warpcast.com/~/channel/${bid.channelId}`}>
                                                <div>
                                                    {bid.tokenProfileImage ? (
                                                        <img className='w-8 h-8 rounded-full' src={bid.tokenProfileImage ?? ''} alt="token profile Image" />
                                                    ) : (
                                                        <div className="bg-gradient-to-b from-violet-500 to-blue-600 w-8 h-8 rounded-full shadow-lg"></div>
                                                    )}
                                                </div>
                                                {bid.tokenProfileName ?? bid.auctioningToken?.slice(0, 5) + "..." + bid.auctioningToken?.slice(bid.auctioningToken?.length - 4, bid.auctioningToken?.length)}
                                                <Farcaster />
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatNumber(Number(bid.volume))} MOXIE
                                        <span className="text-xs text-[#767676] ml-1">({(Number(bid.volume) * price).toLocaleString()}$)</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-[#767676]">{formatRelativeTime(Number(bid.timestamp))}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {userHasAlreadyBid ? (
                                            <button onClick={() => onCancelBidHandler(bid.auctionId ?? '', bid.encodedOrderId)} className="text-sm text-[white] bg-[#f65b58] rounded-full px-4 py-2">
                                                Cancel Bid
                                            </button>) : (
                                            // () => onBidHandler(bid.auctionId ?? '', bid.price, bid.encodedOrderId)
                                            <button
                                                onClick={isActiveFT ? () => ModalOpenHandler(bid) : undefined}
                                                className={`text-sm text-[white] ${isActiveFT ? 'bg-[#8658F6]' : 'bg-gray-400 cursor-not-allowed text-black font-bold'} rounded-full px-4 py-2`}
                                            // disabled={!isActiveFT}
                                            >
                                                {isActiveFT ? 'Bid' : 'Auction Ended'}
                                            </button>)
                                        }
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Paginate currentPage={Number(currentPage) ?? 1} totalBids={totalBids} PAGE_SIZE={PAGE_SIZE} setCurrentPage={setCurrentPage} />
        </div >
    );
};

export default Hero;
