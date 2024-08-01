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

  useEffect(() => {
    const getBids = async () => {
      try {
        const data = await fetchAuctionsWithBids();
        console.log(data);
        setBids(data);
        setTotalBids(data.length);
      } catch (e) {
        console.error("Failed to fetch bids", e);
        setError("Failed to fetch bids");
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

  return (
    <div className="p-4">
      <div>
        {error && <p className="text-red-500">{error}</p>}
        <table className="min-w-full divide-y divide-gray-200 bg-black text-white" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead className="bg-purple-700" style={{ borderRadius: '0.75rem' }}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" style={{ borderTopLeftRadius: '0.75rem' }}>User Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Auctioning Token</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Tokens Bidded</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider" style={{ borderTopRightRadius: '0.75rem' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-700">
            {paginatedBids.map((bid, index) => (
              <tr key={bid.encodedOrderId}>
                <td className="px-6 py-4 whitespace-nowrap" style={index === paginatedBids.length - 1 ? { borderBottomLeftRadius: '0.75rem' } : {}}>{bid.user.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">Bided On {bid.auctioningToken}</td>
                <td className="px-6 py-4 whitespace-nowrap">{bid.volume} Moxie</td>
                <td className="px-6 py-4 whitespace-nowrap">{bid.price}$</td>
                <td className="px-6 py-4 whitespace-nowrap" style={index === paginatedBids.length - 1 ? { borderBottomRightRadius: '0.75rem' } : {}}>{formatRelativeTime(Number(bid.timestamp))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between">
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
