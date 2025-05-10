"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function NewCampaignPage() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setIsCreating(true);
    try {
      // Create campaign logic would go here

      // Redirect to campaign details page
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error creating campaign:", error);
    } finally {
      setIsCreating(false);
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => (window.location.href = "/dashboard")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                placeholder="Enter a name for your campaign"
                required
              />
            </div>

            <div>
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://your-product.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="payout">Payout per Conversion (SOL)</Label>
              <Input
                id="payout"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.1"
                required
              />
            </div>

            <div>
              <Label htmlFor="budget">Campaign Budget (SOL)</Label>
              <Input
                id="budget"
                type="number"
                step="0.1"
                min="0"
                placeholder="1.0"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </form>
      </Card>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Campaign Creation</DialogTitle>
            <DialogDescription>
              This will create a new campaign and transfer the budget amount to
              the campaign vault. The funds will be used to pay affiliates when
              conversions occur.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="bg-indigo-500 hover:bg-indigo-600"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Confirm & Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
