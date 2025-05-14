"use client";

import { CheckCircle, Wallet } from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const router = useRouter();

  const handleClick = () => {
    if (!connected) {
      setVisible(true);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-16 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              <span className="block">Direct</span>
              <span className="block text-indigo-500">Affiliate Marketing</span>
              <span className="block">on Solana</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              Connect merchants and affiliates directly with automated
              commission distribution, transparent tracking, and instant SOL
              payouts on Solana.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                size="lg"
                className="bg-indigo-500 hover:bg-indigo-600"
                onClick={handleClick}
              >
                {connected ? "Go to Dashboard" : "Connect Wallet"}
                <Wallet className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="link"
                size="lg"
                className="text-gray-300 hover:text-white"
                onClick={() => (window.location.href = "#how-it-works")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Simple and transparent affiliate marketing powered by Solana smart
              contracts
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "For Merchants",
                features: [
                  "Register your business",
                  "Set your commission rate",
                  "Connect with affiliates",
                  "Automated SOL payouts",
                ],
              },
              {
                title: "For Affiliates",
                features: [
                  "Register as an affiliate",
                  "Join merchant programs",
                  "Track your earnings",
                  "Receive instant SOL",
                ],
              },
              {
                title: "Platform Benefits",
                features: [
                  "Smart contract security",
                  "Direct relationships",
                  "Low transaction fees",
                  "No intermediaries",
                ],
              },
            ].map((group, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm"
              >
                <h3 className="text-xl font-semibold text-white mb-6">
                  {group.title}
                </h3>
                <ul className="space-y-4">
                  {group.features.map((feature, j) => (
                    <li key={j} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mt-0.5 mr-3" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Get Started Section */}
      <div id="get-started" className="py-20 bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-300">
              Connect your Solana wallet to register as a merchant or affiliate
            </p>
            <div className="mt-10">
              <Button
                size="lg"
                className="bg-indigo-500 hover:bg-indigo-600"
                onClick={handleClick}
              >
                {connected ? "Go to Dashboard" : "Connect Wallet"}
                <Wallet className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
