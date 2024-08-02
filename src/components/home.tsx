"use client";

import { fetchAuctionsWithBids } from "@/app/_actions/queries";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

const PAGE_SIZE = 10;

const Hero = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalBids, setTotalBids] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getBids = async () => {
      try {
        const data = await fetchAuctionsWithBids();
        data.sort((a, b) => b.timestamp - a.timestamp);
        setBids(data);
        setTotalBids(data.length);
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch bids", e);
        setError("Failed to fetch bids");
        setLoading(false);
      }
    };

    getBids();
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

  if (loading) return (
    <div className="flex bg-opacity-50 z-50 justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="px-20 font-rubik">
      <div>
        <table className="min-w-full divide-y divide-gray-200 bg-black text-white" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead className="">
            <tr className="bg-purple-700 text-md">
              <th className="px-6 py-3 text-white tracking-wider text-left" style={{ borderTopLeftRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' }}>User</th>
              <th className="px-6 py-3 text-white tracking-wider text-left">Moxie</th>
              <th className="px-6 py-3 text-white tracking-wider text-left">Bid</th>
              <th className="px-6 py-3 text-white tracking-wider text-left">Current Price</th>
              <th className="px-6 py-3 text-white tracking-wider text-left" style={{ borderTopRightRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>Time</th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-700">
            {paginatedBids.map((bid, index) => (
              <tr key={bid.encodedOrderId}>
                <td className="px-6 py-4 whitespace-nowrap flex flex-row gap-2 items-center" style={index === paginatedBids.length - 1 ? { borderBottomLeftRadius: '0.75rem' } : {}}>
                  <div>
                    {bid.profileImage ? <img className='w-8 h-8 rounded-full' src={bid.profileImage ?? ''} alt="profile Image" /> :
                      <div className="bg-gradient-to-b from-violet-500 to-blue-600 w-8 h-8 rounded-full shadow-lg"></div>
                    }
                  </div>
                  {bid.profileName === null ? bid.user.address.slice(0, 5) + "..." + bid.user.address.slice(bid.user.address.length - 4, bid.user.address.length) : bid.profileName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{Number(bid.volume).toLocaleString()} Moxie</td>
                <td className="px-6 py-4 whitespace-nowrap flex flex-row gap-2 items-center">
                  <div className="text-[#F7BF6A]">
                    bids on
                  </div>
                  <div>
                    {
                      bid.tokenProfileImage ?
                        <img className='w-8 h-8 rounded-full' src={bid.tokenProfileImage ?? ''} alt="token profile Image" />
                        :
                        <div className="bg-gradient-to-b from-violet-500 to-blue-600 w-8 h-8 rounded-full shadow-lg"></div>
                    }
                  </div>
                  {bid.tokenProfileName ?? bid.auctioningToken?.slice(0, 5) + "..." + bid.auctioningToken?.slice(bid.auctioningToken?.length - 4, bid.auctioningToken?.length)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{Number(bid.price).toLocaleString()}$</td>
                <td className="px-6 py-4 whitespace-nowrap" style={index === paginatedBids.length - 1 ? { borderBottomRightRadius: '0.75rem' } : {}}>{formatRelativeTime(Number(bid.timestamp))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center gap-8 items-center mb-4">
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
