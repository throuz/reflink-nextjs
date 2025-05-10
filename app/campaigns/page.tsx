"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, ExternalLink } from "lucide-react";
import { useProgram } from "@/components/counter/hooks/useProgram";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/components/counter/hooks/useToast";

import { PublicKey } from "@solana/web3.js";
import { ProgramAccount } from "@coral-xyz/anchor";

interface MerchantData {
  authority: PublicKey;
  commissionBps: number;
  active: boolean;
}

export default function CampaignsPage() {
  const { program } = useProgram();
  const { connected, publicKey } = useWallet();
  const { showErrorToast, showSuccessToast } = useToast();
  const [merchants, setMerchants] = useState<ProgramAccount<MerchantData>[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMerchants = async () => {
      if (!program) return;

      try {
        const accounts = await program.account.merchant.all();
        setMerchants(accounts.filter((acc) => acc.account.active));
      } catch (error) {
        console.error("Error fetching merchants:", error);
        showErrorToast(
          "Failed to fetch merchants",
          error instanceof Error ? error : undefined
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMerchants();
  }, [program]);

  const generateReferralLink = (merchantPubkey: PublicKey) => {
    if (!publicKey) return "";

    // Create a URL that includes both the affiliate and merchant public keys
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/ref/${publicKey.toString()}/${merchantPubkey.toString()}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccessToast("Referral link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      showErrorToast(
        "Failed to copy link",
        err instanceof Error ? err : undefined
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Available Campaigns</h2>
        <div className="flex gap-4">
          {connected && (
            <Button variant="secondary" asChild>
              <Link href="/campaigns/new">
                <Link className="w-4 h-4 mr-2" />
                Create Campaign
              </Link>
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div>Loading campaigns...</div>
      ) : merchants.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No active campaigns found</p>
          {connected && (
            <Button variant="link" asChild className="mt-4">
              <Link href="/campaigns/new">Create your first campaign</Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {merchants.map((merchant) => (
            <Card key={merchant.publicKey.toString()} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Merchant Campaign</h3>
                  <p className="text-sm text-gray-500">
                    Commission: {merchant.account.commissionBps / 100}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {merchant.publicKey.toString().slice(0, 8)}...
                    {merchant.publicKey.toString().slice(-8)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {connected ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() =>
                      copyToClipboard(generateReferralLink(merchant.publicKey))
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Copy Referral Link
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Connect Wallet to Get Link
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
