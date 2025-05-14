import { useBalance } from "@/hooks/useBalance";

export function WalletBalance() {
  const { data: balance, isLoading } = useBalance();

  if (isLoading || !balance) return null;

  return (
    <div className="hidden md:flex items-center px-3 py-1.5 rounded-md bg-black/20 border border-gray-800">
      <span className="text-sm text-gray-400">{balance.toFixed(4)} SOL</span>
    </div>
  );
}
