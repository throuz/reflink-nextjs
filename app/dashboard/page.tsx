"use client";

import { ArrowRight, BarChart3, Link } from "lucide-react";

import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";

export default function DashboardPage() {
  const { connected } = useWallet();

  // If not connected, show connection prompt
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-white mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-400 mb-8">
          Please connect your wallet to access the dashboard
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">
        Choose Your Role
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          className="p-6 cursor-pointer hover:border-indigo-500 transition-colors"
          onClick={() => redirect("/dashboard/merchant")}
        >
          <div className="text-center">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">I'm an Merchant</h3>
            <p className="text-gray-400 mb-4">
              Create and manage affiliate marketing campaigns
            </p>
            <Button variant="secondary">
              Continue as Merchant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

        <Card
          className="p-6 cursor-pointer hover:border-indigo-500 transition-colors"
          onClick={() => redirect("/dashboard/affiliate")}
        >
          <div className="text-center">
            <Link className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold mb-2">I'm an Affiliate</h3>
            <p className="text-gray-400 mb-4">
              Find campaigns and earn through referrals
            </p>
            <Button variant="secondary">
              Continue as Affiliate
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
