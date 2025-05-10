"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWallet } from "@solana/wallet-adapter-react";
import { ArrowRight, BarChart3, Link, Plus } from "lucide-react";
import { useState } from "react";

type Role = "affiliate" | "advertiser";

export default function DashboardPage() {
  const { connected } = useWallet();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

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

  // If no role selected, show role selection
  if (!selectedRole) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Choose Your Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card
            className="p-6 cursor-pointer hover:border-indigo-500 transition-colors"
            onClick={() => setSelectedRole("advertiser")}
          >
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
              <h3 className="text-xl font-semibold mb-2">I'm an Advertiser</h3>
              <p className="text-gray-400 mb-4">
                Create and manage affiliate marketing campaigns
              </p>
              <Button variant="secondary">
                Continue as Advertiser
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <Card
            className="p-6 cursor-pointer hover:border-indigo-500 transition-colors"
            onClick={() => setSelectedRole("affiliate")}
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

  // Role-specific dashboard content
  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">
          {selectedRole === "advertiser"
            ? "Advertiser Dashboard"
            : "Affiliate Dashboard"}
        </h2>
        <Button
          className="bg-indigo-500 hover:bg-indigo-600"
          onClick={() =>
            (window.location.href =
              selectedRole === "advertiser" ? "/campaigns/new" : "/campaigns")
          }
        >
          {selectedRole === "advertiser" ? (
            <>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </>
          ) : (
            <>
              <Link className="w-4 h-4 mr-2" />
              Browse Campaigns
            </>
          )}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {selectedRole === "advertiser" ? (
          <>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Active Campaigns
              </h3>
              <p className="text-2xl font-bold">0</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Total Conversions
              </h3>
              <p className="text-2xl font-bold">0</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Budget Spent
              </h3>
              <p className="text-2xl font-bold">0 SOL</p>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Active Links
              </h3>
              <p className="text-2xl font-bold">0</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Total Clicks
              </h3>
              <p className="text-2xl font-bold">0</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Total Earnings
              </h3>
              <p className="text-2xl font-bold">0 SOL</p>
            </Card>
          </>
        )}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="text-center text-gray-400 py-8">
          No recent activity to display
        </div>
      </Card>
    </div>
  );
}
