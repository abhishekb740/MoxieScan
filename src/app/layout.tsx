import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import '@rainbow-me/rainbowkit/styles.css';
import ClientProviders from "./ClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoxieScan",
  description: "Track Moxie Fan Token bids live",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://moxiescan.xyz",
    title: "MoxieScan",
    description: "Track Moxie Fan Token bids live",
    images: {
      url: "https://moxiescan.xyz/metadata.png",
      alt: "MoxieScan",
    }
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <Analytics />
        </ClientProviders>
      </body>
    </html>
  );
}
