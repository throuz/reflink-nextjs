"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProgram } from "@/components/counter/hooks/useProgram";
import { useTransactionToast } from "@/components/counter/hooks/useTransactionToast";
import { StatsCard } from "@/components/counter/StatsCard";
import { useState, useEffect } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { toast } from "sonner";

export default function AffiliateDashboard() {
  const { connected, publicKey } = useWallet();
  const { program } = useProgram();
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState<
    string | null
  >(null);

  // Use transaction toast hook
  useTransactionToast({ transactionSignature });

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
      setIsRegistering(true);

      // Send the transaction
      const txSignature = await program.methods
        .registerAffiliate()
        .accounts({
          authority: publicKey,
        })
        .rpc();

      setTransactionSignature(txSignature);

      // Refresh affiliate data after short delay to allow indexing
      setTimeout(async () => {
        try {
          const [affiliatePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("affiliate"), publicKey.toBuffer()],
            program.programId
          );
          const affiliate = await program.account.affiliate.fetch(affiliatePda);
          setAffiliateData(affiliate);
        } catch (error) {
          console.error("Error fetching updated affiliate data:", error);
        }
      }, 2000);
    } catch (err) {
      toast.error("Transaction Failed", {
        description: `${err}`,
        style: {
          border: "1px solid rgba(239, 68, 68, 0.3)",
          background:
            "linear-gradient(to right, rgba(40, 27, 27, 0.95), rgba(28, 23, 23, 0.95))",
        },
        duration: 5000,
      });
      console.error(err);
    } finally {
      setIsRegistering(false);
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
            <Button
              onClick={handleRegisterAffiliate}
              disabled={isRegistering}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isRegistering ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 rounded-full border-2 border-purple-200/50 border-t-purple-200 animate-spin mr-2"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Register as Affiliate"
              )}
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
