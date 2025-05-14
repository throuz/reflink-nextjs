"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useRegisterMerchant,
  useRegisterAffiliate,
  useUserRole,
} from "@/components/counter/hooks/useReflink";

type Role = "merchant" | "affiliate" | null;

export default function Register() {
  const router = useRouter();
  const { toast } = useToast();
  const { connected } = useWallet();
  const { data: userRole, isLoading } = useUserRole();
  const [role, setRole] = useState<Role>(null);
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [commissionRate, setCommissionRate] = useState("");

  const registerMerchant = useRegisterMerchant();
  const registerAffiliate = useRegisterAffiliate();

  useEffect(() => {
    if (!isLoading && userRole) {
      if (userRole.isMerchant) {
        router.replace("/dashboard/merchant");
      } else if (userRole.isAffiliate) {
        router.replace("/dashboard/affiliate");
      }
    }
  }, [isLoading, userRole, router]);

  // Show nothing while loading or redirecting
  if (
    isLoading ||
    (userRole && (userRole.isMerchant || userRole.isAffiliate))
  ) {
    return null;
  }

  const handleMerchantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !websiteUrl || !commissionRate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await registerMerchant.mutateAsync({
        name,
        websiteUrl,
        commissionRate: parseInt(commissionRate),
      });
      toast({
        title: "Success",
        description: "Merchant registration successful!",
      });
      router.push("/dashboard/merchant");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to register as merchant",
        variant: "destructive",
      });
    }
  };

  const handleAffiliateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    try {
      await registerAffiliate.mutateAsync({ name });
      toast({
        title: "Success",
        description: "Affiliate registration successful!",
      });
      router.push("/dashboard/affiliate");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to register as affiliate",
        variant: "destructive",
      });
    }
  };

  if (!connected) {
    return (
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Please connect your wallet first
          </h1>
          <Button
            onClick={() => router.push("/")}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Choose Your Role
            </h1>
            <p className="text-gray-400 mb-8">
              Select whether you want to register as a merchant or an affiliate
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setRole("merchant")}
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900 hover:bg-indigo-500 hover:border-indigo-500 transition-colors duration-150 p-6 flex flex-col items-center shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="text-lg font-semibold text-white mb-2">
                Merchant
              </span>
              <span className="text-gray-300 text-sm text-center">
                Register your business and set commission rates
              </span>
            </button>
            <button
              onClick={() => setRole("affiliate")}
              className="flex-1 rounded-xl border border-gray-700 bg-gray-900 hover:bg-indigo-500 hover:border-indigo-500 transition-colors duration-150 p-6 flex flex-col items-center shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="text-lg font-semibold text-white mb-2">
                Affiliate
              </span>
              <span className="text-gray-300 text-sm text-center">
                Join as an affiliate and earn commissions
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Register as {role === "merchant" ? "Merchant" : "Affiliate"}
          </h1>
          <Button
            variant="link"
            onClick={() => setRole(null)}
            className="text-gray-400 hover:text-white"
          >
            Change Role
          </Button>
        </div>

        {role === "merchant" ? (
          <form onSubmit={handleMerchantSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your business name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://your-business.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Commission Rate (%)</Label>
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="Enter commission rate (0-100)"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600"
              disabled={registerMerchant.isPending}
            >
              {registerMerchant.isPending
                ? "Registering..."
                : "Register as Merchant"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleAffiliateSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600"
              disabled={registerAffiliate.isPending}
            >
              {registerAffiliate.isPending
                ? "Registering..."
                : "Register as Affiliate"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
