import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
