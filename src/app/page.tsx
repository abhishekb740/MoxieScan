import Navbar from "@/components/navbar";
import { fetchAuctionsWithBids } from "@/app/_actions/queries";
import Hero from "@/components/home";
import { fetchMoxiePrice } from "@/app/_actions/queries";

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";


export default async function Home() {
  try {
    const data = await fetchAuctionsWithBids();
    data.sort((a, b) => b.timestamp - a.timestamp);
    const price = await fetchMoxiePrice();
    return (
      <main className="flex min-h-screen flex-col">
        <div>
          <div className="m-4">
            <Navbar />
          </div>
          <Hero price={price} initialBids={data as Bid[]} totalBids={data.length} />
        </div>
      </main>
    );
  } catch {
    return (
      <main className="flex min-h-screen flex-col items-center">
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
