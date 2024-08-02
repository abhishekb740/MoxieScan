import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";
import { fetchAuctionsWithBids } from "@/app/_actions/queries";

export const fetchCache = "force-no-store";

const Hero = dynamic(() => import("@/components/home"), {
  loading: () => (
    <div className="flex bg-opacity-50 z-50 justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

export default async function Home() {
  try {
    const data = await fetchAuctionsWithBids();
    data.sort((a, b) => b.timestamp - a.timestamp);
    return (
      <main className="flex min-h-screen flex-col">
        <div>
          <div className="m-4">
            <Navbar />
          </div>
          <Hero bids={data as Bid[]} totalBids={data.length} />
        </div>
      </main>
    );
  } catch {
    return (
      <main className="flex min-h-screen flex-col">
        <div>
          <div className="m-4">
            <Navbar />
          </div>
          <p className="text-white font-medium">Failed to fetch bids...</p>
        </div>
      </main>
    );
  }
}
