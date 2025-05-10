"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, ExternalLink } from "lucide-react";

export default function CampaignsPage() {
  // This would be fetched from the Solana program
  const campaigns = [];

  return (
    <div className="max-w-7xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Available Campaigns</h2>
        <div className="flex gap-4">
          <Button variant="secondary">
            <Link className="w-4 h-4 mr-2" />
            My Links
          </Button>
        </div>
      </div>

      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              {/* Campaign details would go here */}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <ExternalLink className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              No Campaigns Available
            </h3>
            <p className="text-gray-400 mb-6">
              There are no active campaigns at the moment. Check back later or
              create your own campaign.
            </p>
            <Button
              variant="secondary"
              onClick={() => (window.location.href = "/campaigns/new")}
            >
              Create a Campaign
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
