"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProgram } from "@/components/counter/hooks/useProgram";
import { useToast } from "@/components/counter/hooks/useToast";
import { StatsCard } from "@/components/counter/StatsCard";
import { useState, useEffect } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";

export default function AffiliateDashboard() {
  const { connected, publicKey } = useWallet();
  const { program } = useProgram();
  const { showSuccessToast, showErrorToast } = useToast();
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!program || !publicKey) {
      setIsLoading(false);
      return;
    }

    const fetchAffiliateData = async () => {
      try {
        const [affiliatePda] = PublicKey.findProgramAddressSync(
          [Buffer.from("affiliate"), publicKey.toBuffer()],
          program.programId
        );

        const affiliate = await program.account.affiliate.fetch(affiliatePda);
        setAffiliateData(affiliate);
      } catch (error) {
        console.error("Error fetching affiliate data:", error);
        setAffiliateData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliateData();
  }, [program, publicKey]);

  const handleRegisterAffiliate = async () => {
    if (!program || !publicKey) return;

    try {
      const [affiliatePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("affiliate"), publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .registerAffiliate()
        .accounts({
          affiliate: affiliatePda,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      showSuccessToast("Successfully registered as affiliate!", tx);

      // Refresh affiliate data
      const affiliate = await program.account.affiliate.fetch(affiliatePda);
      setAffiliateData(affiliate);
    } catch (error) {
      console.error(error);
      showErrorToast(
        "Failed to register as affiliate",
        error instanceof Error ? error : undefined
      );
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p>Please connect your wallet to access the affiliate dashboard.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Loading affiliate data...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Affiliate Dashboard</h1>

      {!affiliateData ? (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Register as Affiliate</h2>
          <div className="space-y-4">
            <p className="text-gray-500">
              Register to start earning commissions from merchant referrals.
            </p>
            <Button onClick={handleRegisterAffiliate} className="w-full">
              Register as Affiliate
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <StatsCard
            title="Affiliate Statistics"
            stats={[
              {
                label: "Total Earned",
                value: `${affiliateData.totalEarned / 1e9} SOL`,
              },
              {
                label: "Total Referrals",
                value: affiliateData.totalReferrals.toString(),
              },
            ]}
          />

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <p className="text-gray-500">No recent activity</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
