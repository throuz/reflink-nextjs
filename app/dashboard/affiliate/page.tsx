"use client";

import { useState } from "react";

import { Check, ClipboardCopy } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAffiliate,
  useAffiliateMerchants,
  useAllMerchants,
  useJoinMerchant,
  useUpdateAffiliate,
} from "@/components/counter/hooks/useReflink";

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
  const { data: allMerchants, isLoading: allMerchantsLoading } =
    useAllMerchants();
  const queryClient = useQueryClient();

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLoading, setEditLoading] = useState(false);

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
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to update profile.",
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

      {/* Available Merchants Card */}
      <Card>
        <CardHeader>
          <CardTitle>Available Merchants</CardTitle>
        </CardHeader>
        <CardContent>
          {allMerchantsLoading ? (
            <div>Loading merchants...</div>
          ) : allMerchants && allMerchants.length > 0 ? (
            <div className="space-y-4">
              {allMerchants.map((m) => {
                const alreadyJoined = merchants?.some(
                  (joined) =>
                    joined.publicKey.toBase58() === m.publicKey.toBase58()
                );
                return (
                  <div
                    key={m.publicKey.toBase58()}
                    className="border border-gray-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-gray-400 text-sm">
                        {m.websiteUrl}
                      </div>
                      <div className="text-xs mt-1">
                        Commission Rate: <b>{m.commissionRate?.toString()}%</b>
                      </div>
                    </div>
                    {alreadyJoined ? (
                      <span className="text-green-500 text-xs font-semibold">
                        Joined
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() =>
                          joinMerchant.mutate(
                            { merchantAuthority: m.authority },
                            {
                              onSuccess: () => {
                                queryClient.invalidateQueries({
                                  queryKey: [
                                    "affiliateMerchants",
                                    publicKey?.toBase58(),
                                  ],
                                });
                                queryClient.invalidateQueries({
                                  queryKey: ["allMerchants"],
                                });
                              },
                            }
                          )
                        }
                        disabled={joinMerchant.isPending}
                      >
                        Join
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>No merchants available.</div>
          )}
        </CardContent>
      </Card>

      {/* Merchants Joined Card */}
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
                    <th className="py-2 px-4 text-left">Referral Link</th>
                  </tr>
                </thead>
                <tbody>
                  {merchants.map((m) => (
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
                      <td className="py-2 px-4">
                        <CopyReferralButton
                          link={`${m.websiteUrl}/?ref=${publicKey?.toBase58()}`}
                        />
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

function CopyReferralButton({ link }: { link: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      className="h-8 w-8 px-0"
      onClick={async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        toast({
          title: "Copied!",
          description: "Referral link copied to clipboard.",
        });
        setTimeout(() => setCopied(false), 1000);
      }}
      aria-label="Copy referral link"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-400" />
      ) : (
        <ClipboardCopy className="h-4 w-4" />
      )}
    </Button>
  );
}
