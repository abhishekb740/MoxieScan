"use client";
import Hero from "@/components/home";
import Navbar from "@/components/navbar";

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col">
      <div>
        <div className="m-4">
          <Navbar />
        </div>
        <Hero />
      </div>
    </main>
  );
}
