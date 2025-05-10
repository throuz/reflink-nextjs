"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useProgram } from "@/components/counter/hooks/useProgram";
import { useTransactionToast } from "@/components/counter/hooks/useTransactionToast";
import { StatsCard } from "@/components/counter/StatsCard";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { toast } from "sonner";

export default function MerchantDashboard() {
  const { connected, publicKey } = useWallet();
  const { program } = useProgram();
  const [commissionRate, setCommissionRate] = useState<number>(5);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [merchantData, setMerchantData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
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

    const fetchMerchantData = async () => {
      try {
        const [merchantPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("merchant"), publicKey.toBuffer()],
          program.programId
        );

        const merchant = await program.account.merchant.fetch(merchantPda);
        setMerchantData(merchant);
        setCommissionRate(merchant.commissionBps / 100);
        setIsActive(merchant.active);
      } catch (error) {
        console.error("Error fetching merchant data:", error);
        setMerchantData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMerchantData();
  }, [program, publicKey]);

  const handleRegisterMerchant = async () => {
    if (!program || !publicKey) return;

    try {
      setIsProcessing(true);

      const tx = await program.methods
        .registerMerchant(new anchor.BN(commissionRate * 100))
        .accounts({
          authority: publicKey,
        })
        .rpc();

      setTransactionSignature(tx);

      // Refresh merchant data after short delay to allow indexing
      setTimeout(async () => {
        try {
          const [merchantPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("merchant"), publicKey.toBuffer()],
            program.programId
          );
          const merchant = await program.account.merchant.fetch(merchantPda);
          setMerchantData(merchant);
        } catch (error) {
          console.error("Error fetching updated merchant data:", error);
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
      setIsProcessing(false);
    }
  };

  const handleUpdateCommission = async () => {
    if (!program || !publicKey) return;

    try {
      setIsProcessing(true);

      const tx = await program.methods
        .updateMerchantCommission(new anchor.BN(commissionRate * 100))
        .accounts({
          authority: publicKey,
        })
        .rpc();

      setTransactionSignature(tx);

      // Refresh merchant data after short delay to allow indexing
      setTimeout(async () => {
        try {
          const [merchantPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("merchant"), publicKey.toBuffer()],
            program.programId
          );
          const merchant = await program.account.merchant.fetch(merchantPda);
          setMerchantData(merchant);
        } catch (error) {
          console.error("Error fetching updated merchant data:", error);
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
      setIsProcessing(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!program || !publicKey) return;

    try {
      setIsProcessing(true);

      const tx = await program.methods
        .toggleMerchantStatus()
        .accounts({
          authority: publicKey,
        })
        .rpc();

      setTransactionSignature(tx);

      // Toggle state optimistically but refresh from chain
      setIsActive(!isActive);

      // Refresh merchant data after short delay to allow indexing
      setTimeout(async () => {
        try {
          const [merchantPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("merchant"), publicKey.toBuffer()],
            program.programId
          );
          const merchant = await program.account.merchant.fetch(merchantPda);
          setMerchantData(merchant);
          setIsActive(merchant.active);
        } catch (error) {
          console.error("Error fetching updated merchant data:", error);
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
      setIsProcessing(false);
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p>Please connect your wallet to access the merchant dashboard.</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Loading merchant data...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Merchant Dashboard</h1>

      {!merchantData ? (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Register as Merchant</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="commission">Commission Rate (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
              />
            </div>
            <Button
              onClick={handleRegisterMerchant}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="h-5 w-5 rounded-full border-2 border-purple-200/50 border-t-purple-200 animate-spin mr-2"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                "Register as Merchant"
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Merchant Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="commissionUpdate">Commission Rate (%)</Label>
                <div className="flex gap-4">
                  <Input
                    id="commissionUpdate"
                    type="number"
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                  />
                  <Button
                    onClick={handleUpdateCommission}
                    disabled={isProcessing}
                    variant="secondary"
                  >
                    {isProcessing ? "Updating..." : "Update"}
                  </Button>
                </div>
              </div>
              <div>
                <Label>Account Status</Label>
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>{isActive ? "Active" : "Inactive"}</span>
                  <Button
                    onClick={handleToggleStatus}
                    disabled={isProcessing}
                    variant="secondary"
                  >
                    {isProcessing
                      ? "Processing..."
                      : isActive
                      ? "Deactivate"
                      : "Activate"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <StatsCard
            title="Performance"
            stats={[
              {
                label: "Commission Rate",
                value: `${merchantData.commissionBps / 100}%`,
              },
              {
                label: "Status",
                value: merchantData.active ? "Active" : "Inactive",
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
