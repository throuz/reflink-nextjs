import { Card } from "@/components/ui/card";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface StatsCardProps {
  title: string;
  stats: {
    label: string;
    value: string | number;
  }[];
}

export function StatsCard({ title, stats }: StatsCardProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function formatSolAmount(lamports: number): string {
  return `${(lamports / LAMPORTS_PER_SOL).toFixed(4)} SOL`;
}
