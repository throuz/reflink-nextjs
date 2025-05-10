"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/components/counter/hooks/useProgram";
import { useToast } from "@/components/counter/hooks/useToast";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export default function NewCampaignPage() {
  const router = useRouter();
  const { connected, publicKey } = useWallet();
  const { program } = useProgram();
  const { showSuccessToast, showErrorToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    commission: 5, // Default 5%
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program || !publicKey) return;

    try {
      const [merchantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merchant"), publicKey.toBuffer()],
        program.programId
      );

      // Register as a merchant with the specified commission rate
      const tx = await program.methods
        .registerMerchant(new anchor.BN(formData.commission * 100)) // Convert to basis points
        .accounts({
          merchant: merchantPda,
          authority: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      showSuccessToast("Campaign created successfully!", tx);
      router.push("/campaigns");
    } catch (error) {
      showErrorToast(
        "Failed to create campaign",
        error instanceof Error ? error : undefined
      );
      console.error(error);
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p>Please connect your wallet to create a campaign.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/campaigns">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Create New Campaign</h1>

      <Card className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe your campaign"
              required
            />
          </div>

          <div>
            <Label htmlFor="commission">Commission Rate (%)</Label>
            <Input
              id="commission"
              type="number"
              min="0"
              max="100"
              value={formData.commission}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  commission: Number(e.target.value),
                }))
              }
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Create Campaign
          </Button>
        </form>
      </Card>
    </div>
  );
}
