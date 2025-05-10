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
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export default function MerchantDashboard() {
  const { connected, publicKey } = useWallet();
  const { program } = useProgram();
  const { showSuccessToast, showErrorToast } = useTransactionToast();
  const [commissionRate, setCommissionRate] = useState<number>(5);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [merchantData, setMerchantData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const [merchantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merchant"), publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .registerMerchant(commissionRate * 100)
        .accounts({
          authority: publicKey,
          merchant: merchantPda,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .instruction();

      showSuccessToast("Successfully registered as a merchant!");

      // Refresh merchant data
      const merchant = await program.account.merchant.fetch(merchantPda);
      setMerchantData(merchant);
    } catch (error) {
      showErrorToast("Failed to register as merchant");
      console.error(error);
    }
  };

  const handleUpdateCommission = async () => {
    if (!program || !publicKey) return;

    try {
      const [merchantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merchant"), publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .updateMerchantCommission(commissionRate * 100)
        .accounts({
          merchantAccount: merchantPda,
          authority: publicKey,
        })
        .rpc();

      showSuccessToast("Successfully updated commission rate!");

      // Refresh merchant data
      const merchant = await program.account.merchant.fetch(merchantPda);
      setMerchantData(merchant);
    } catch (error) {
      showErrorToast("Failed to update commission rate");
      console.error(error);
    }
  };

  const handleToggleStatus = async () => {
    if (!program || !publicKey) return;

    try {
      const [merchantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merchant"), publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .toggleMerchantStatus()
        .accounts({
          merchantAccount: merchantPda,
          authority: publicKey,
        })
        .rpc();

      setIsActive(!isActive);
      showSuccessToast("Successfully toggled merchant status!");

      // Refresh merchant data
      const merchant = await program.account.merchant.fetch(merchantPda);
      setMerchantData(merchant);
    } catch (error) {
      showErrorToast("Failed to toggle status");
      console.error(error);
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
            <Button onClick={handleRegisterMerchant} className="w-full">
              Register as Merchant
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Merchant Settings</h2>

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

              <Button onClick={handleUpdateCommission} className="w-full">
                Update Commission Rate
              </Button>

              <Button
                onClick={handleToggleStatus}
                variant={isActive ? "destructive" : "default"}
                className="w-full"
              >
                {isActive
                  ? "Deactivate Merchant Account"
                  : "Activate Merchant Account"}
              </Button>
            </div>
          </Card>

          <StatsCard
            title="Merchant Statistics"
            stats={[
              {
                label: "Status",
                value: isActive ? "Active" : "Inactive",
              },
              {
                label: "Current Commission",
                value: `${commissionRate}%`,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
