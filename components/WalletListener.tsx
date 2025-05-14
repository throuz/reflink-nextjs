"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

export function WalletListener() {
  const { publicKey } = useWallet();
  const router = useRouter();

  useEffect(() => {
    // When the wallet changes (including disconnection), redirect to home page
    router.push("/");
  }, [publicKey, router]);

  return null; // This is a utility component that doesn't render anything
}
