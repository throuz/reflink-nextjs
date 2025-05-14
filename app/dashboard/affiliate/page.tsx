"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useAffiliate,
  useAffiliateMerchants,
  useUpdateAffiliate,
  useJoinMerchant,
} from "@/components/counter/hooks/useReflink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PublicKey } from "@solana/web3.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function AffiliateDashboard() {
  const { publicKey } = useWallet();
  const {
    data: affiliate,
    isLoading: affiliateLoading,
    error: affiliateError,
  } = useAffiliate(publicKey!);
  const {
    data: merchants,
    isLoading: merchantsLoading,
    error: merchantsError,
  } = useAffiliateMerchants(publicKey!);
  const updateAffiliate = useUpdateAffiliate();
  const joinMerchant = useJoinMerchant();
  const { toast } = useToast();

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Join merchant modal state
  const [joinOpen, setJoinOpen] = useState(false);
  const [merchantAuthority, setMerchantAuthority] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  // Open edit modal and prefill
  const openEdit = () => {
    setEditName(affiliate?.name || "");
    setEditOpen(true);
  };

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateAffiliate.mutateAsync({
        name: editName,
      });
      setEditOpen(false);
      toast({
        title: "Success",
        description: "Profile updated.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Handle join merchant
  const handleJoinMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinLoading(true);
    try {
      await joinMerchant.mutateAsync({
        merchantAuthority: new PublicKey(merchantAuthority),
      });
      setJoinOpen(false);
      setMerchantAuthority("");
      toast({
        title: "Success",
        description: "Joined merchant successfully.",
      });
    } catch (e) {
      toast({
        title: "Error",
        description:
          "Failed to join merchant. Make sure the address is correct and you are not already joined.",
        variant: "destructive",
      });
    } finally {
      setJoinLoading(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold mb-4">Please connect your wallet</h2>
        <Button onClick={() => (window.location.href = "/")}>Go Home</Button>
      </div>
    );
  }

  if (affiliateLoading)
    return <div className="text-center py-12">Loading affiliate info...</div>;
  if (affiliateError)
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load affiliate info.
      </div>
    );
  if (!affiliate)
    return (
      <div className="text-center py-12">
        You are not registered as an affiliate.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Affiliate Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            Affiliate Dashboard
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={openEdit}>
                Edit Profile
              </Button>
              <Button size="sm" onClick={() => setJoinOpen(true)}>
                Join Merchant
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-lg font-semibold">{affiliate.name}</div>
            <div className="flex flex-wrap gap-4 text-sm mt-2">
              <span>
                Total Commission:{" "}
                <b>{Number(affiliate.totalCommission?.toString()) / 1e9} SOL</b>
              </span>
              <span>
                Total Referrals: <b>{affiliate.totalReferrals?.toString()}</b>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Merchants List */}
      <Card>
        <CardHeader>
          <CardTitle>Merchants Joined</CardTitle>
        </CardHeader>
        <CardContent>
          {merchantsLoading ? (
            <div>Loading merchants...</div>
          ) : merchantsError ? (
            <div className="text-red-500">Failed to load merchants.</div>
          ) : merchants && merchants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-2 px-4 text-left">Merchant Name</th>
                    <th className="py-2 px-4 text-left">Website</th>
                    <th className="py-2 px-4 text-left">Commission Rate (%)</th>
                    <th className="py-2 px-4 text-left">
                      Commission Earned (SOL)
                    </th>
                    <th className="py-2 px-4 text-left">
                      Successful Referrals
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {merchants.map((m: any) => (
                    <tr
                      key={m.publicKey.toBase58()}
                      className="border-b border-gray-800"
                    >
                      <td className="py-2 px-4">{m.name}</td>
                      <td className="py-2 px-4">{m.websiteUrl}</td>
                      <td className="py-2 px-4">
                        {m.commissionRate?.toString()}
                      </td>
                      <td className="py-2 px-4">
                        {Number(m.relationship.commissionEarned?.toString()) /
                          1e9}
                      </td>
                      <td className="py-2 px-4">
                        {m.relationship.successfulReferrals?.toString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>You have not joined any merchants yet.</div>
          )}
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="mb-1 block">
                  Your Name
                </Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" disabled={editLoading} className="flex-1">
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={editLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Join Merchant Dialog */}
      <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Merchant</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleJoinMerchant}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="merchant-authority" className="mb-1 block">
                  Merchant Authority Address
                </Label>
                <Input
                  id="merchant-authority"
                  value={merchantAuthority}
                  onChange={(e) => setMerchantAuthority(e.target.value)}
                  placeholder="Enter merchant's wallet address"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" disabled={joinLoading} className="flex-1">
                  {joinLoading ? "Joining..." : "Join"}
                </Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={joinLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
