"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useMerchant,
  useMerchantAffiliates,
  useUpdateMerchant,
} from "@/components/counter/hooks/useReflink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function MerchantDashboard() {
  const { publicKey } = useWallet();
  const {
    data: merchant,
    isLoading: merchantLoading,
    error: merchantError,
  } = useMerchant(publicKey!);
  const {
    data: affiliates,
    isLoading: affiliatesLoading,
    error: affiliatesError,
  } = useMerchantAffiliates(publicKey!);
  const updateMerchant = useUpdateMerchant();
  const { toast } = useToast();

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editCommission, setEditCommission] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Toggle status
  const handleToggleStatus = async () => {
    if (!merchant) return;
    try {
      await updateMerchant.mutateAsync({
        isActive: !merchant.isActive,
      });
      toast({
        title: "Success",
        description: `Merchant is now ${
          merchant.isActive ? "inactive" : "active"
        }.`,
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  // Open edit modal and prefill
  const openEdit = () => {
    setEditName(merchant?.name || "");
    setEditWebsite(merchant?.websiteUrl || "");
    setEditCommission(merchant?.commissionRate?.toString() || "");
    setEditOpen(true);
  };

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateMerchant.mutateAsync({
        name: editName,
        websiteUrl: editWebsite,
        commissionRate: Number(editCommission),
      });
      setEditOpen(false);
      toast({
        title: "Success",
        description: "Merchant info updated.",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to update merchant info.",
        variant: "destructive",
      });
    } finally {
      setEditLoading(false);
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

  if (merchantLoading)
    return <div className="text-center py-12">Loading merchant info...</div>;
  if (merchantError)
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load merchant info.
      </div>
    );
  if (!merchant)
    return (
      <div className="text-center py-12">
        You are not registered as a merchant.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Merchant Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-between">
            Merchant Dashboard
            <Button size="sm" variant="outline" onClick={openEdit}>
              Edit Info
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-lg font-semibold">{merchant.name}</div>
            <div className="text-gray-400 text-sm mb-2">
              {merchant.websiteUrl}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                Commission Rate: <b>{merchant.commissionRate?.toString()}%</b>
              </span>
              <span>
                Total Revenue:{" "}
                <b>{Number(merchant.totalRevenue?.toString()) / 1e9} SOL</b>
              </span>
              <span>
                Total Referrals: <b>{merchant.totalReferrals?.toString()}</b>
              </span>
              <span>
                Status: <b>{merchant.isActive ? "Active" : "Inactive"}</b>
              </span>
            </div>
          </div>
          <Button
            size="sm"
            variant={merchant.isActive ? "destructive" : "default"}
            onClick={handleToggleStatus}
            disabled={updateMerchant.isPending}
          >
            {merchant.isActive ? "Deactivate Merchant" : "Activate Merchant"}
          </Button>
        </CardContent>
      </Card>

      {/* Affiliates List */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliates Joined</CardTitle>
        </CardHeader>
        <CardContent>
          {affiliatesLoading ? (
            <div>Loading affiliates...</div>
          ) : affiliatesError ? (
            <div className="text-red-500">Failed to load affiliates.</div>
          ) : affiliates && affiliates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="py-2 px-4 text-left">Affiliate Name</th>
                    <th className="py-2 px-4 text-left">
                      Commission Earned (SOL)
                    </th>
                    <th className="py-2 px-4 text-left">
                      Successful Referrals
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {affiliates.map((a) => (
                    <tr
                      key={a.publicKey.toBase58()}
                      className="border-b border-gray-800"
                    >
                      <td className="py-2 px-4">{a.name}</td>
                      <td className="py-2 px-4">
                        {Number(a.relationship.commissionEarned?.toString()) /
                          1e9}
                      </td>
                      <td className="py-2 px-4">
                        {a.relationship.successfulReferrals?.toString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No affiliates have joined your program yet.</div>
          )}
        </CardContent>
      </Card>

      {/* Edit Info Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Merchant Info</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="mb-1 block">
                  Business Name
                </Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-website" className="mb-1 block">
                  Website URL
                </Label>
                <Input
                  id="edit-website"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-commission" className="mb-1 block">
                  Commission Rate (%)
                </Label>
                <Input
                  id="edit-commission"
                  type="number"
                  min={0}
                  max={100}
                  value={editCommission}
                  onChange={(e) => setEditCommission(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={editLoading}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
