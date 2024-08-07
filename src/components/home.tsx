/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { fetchAuctionsWithBids } from "@/app/_actions/queries";
import {motion} from "framer-motion";

const PAGE_SIZE = 10;

type HeroProps = {
    price: number;
    initialBids: Bid[];
    totalBids: number;
};

const Hero = ({ price, initialBids, totalBids }: HeroProps) => {
    const [bids, setBids] = useState<Bid[]>(initialBids);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [newBids, setNewBids] = useState<Bid[]>([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const updatedBids = await fetchAuctionsWithBids();
                const newBids = updatedBids.filter((bid) => !bids.some((b) => b.encodedOrderId === bid.encodedOrderId));
                setNewBids(newBids);
                console.log(newBids);
                setBids(updatedBids);
            } catch (error) {
                console.error("Failed to fetch bids:", error);
            }
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    const formatRelativeTime = (timestamp: number) => {
        return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const paginatedBids = bids.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div className="px-4 md:px-20 font-rubik">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-black text-white">
                    <thead>
                        <tr className="bg-purple-700 text-md">
                            <th className="px-6 py-3 text-white tracking-wider text-left" style={{ borderTopLeftRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' }}>User</th>
                            <th className="px-6 py-3 text-white tracking-wider text-left">Moxie</th>
                            <th className="px-6 py-3 text-white tracking-wider text-left">Bid</th>
                            <th className="px-6 py-3 text-white tracking-wider text-left">Current Price</th>
                            <th className="px-6 py-3 text-white tracking-wider text-left" style={{ borderTopRightRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>Time</th>
                        </tr>
                    </thead>



                    <tbody className="bg-black divide-y divide-gray-700">
                        {paginatedBids.map((bid) => {
                            const isNewBid = newBids.some(newBid => newBid.encodedOrderId === bid.encodedOrderId);

                            return (
                                <motion.tr
                                    key={bid.encodedOrderId}
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
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{Number(bid.volume).toLocaleString()} Moxie</td>
                                    <td className="px-6 py-4 whitespace-nowrap flex flex-row gap-2 items-center">
                                        <div className="text-[#F7BF6A]">bids on</div>
                                        <Link className="flex flex-row gap-2 items-center" target="_black" href={bid.isFid ? `https://warpcast.com/${bid.tokenProfileName}` : `https://warpcast.com/~/channel/${bid.channelId}`}>
                                            <div>
                                                {bid.tokenProfileImage ? (
                                                    <img className='w-8 h-8 rounded-full' src={bid.tokenProfileImage ?? ''} alt="token profile Image" />
                                                ) : (
                                                    <div className="bg-gradient-to-b from-violet-500 to-blue-600 w-8 h-8 rounded-full shadow-lg"></div>
                                                )}
                                            </div>
                                            {bid.tokenProfileName ?? bid.auctioningToken?.slice(0, 5) + "..." + bid.auctioningToken?.slice(bid.auctioningToken?.length - 4, bid.auctioningToken?.length)}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{(Number(bid.volume) * price).toLocaleString()}$</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatRelativeTime(Number(bid.timestamp))}</td>
                                </motion.tr>
                            );
                        })}
                    </tbody>


                </table>
            </div>
            <div className="mt-4 flex justify-center gap-4 md:gap-8 items-center mb-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-purple-700 text-white rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {currentPage} of {Math.ceil(totalBids / PAGE_SIZE)}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(totalBids / PAGE_SIZE)}
                    className="px-4 py-2 bg-purple-700 text-white rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Hero;
