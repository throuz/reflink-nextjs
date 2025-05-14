import { Metadata } from "next";

import { Inter } from "next/font/google";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Toaster } from "@/components/ui/toast";

import Providers from "./providers";

import "@solana/wallet-adapter-react-ui/styles.css";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Reflink | Direct Merchant-Affiliate Platform on Solana",
  description:
    "Connect merchants and affiliates directly with automated commission distribution and instant SOL payouts on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} antialiased min-h-screen bg-gray-900 text-white`}
      >
        <Providers>
          <BaseLayout>{children}</BaseLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
