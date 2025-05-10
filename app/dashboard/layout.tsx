"use client";

import { redirect } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { connected } = useWallet();

  useEffect(() => {
    if (!connected) {
      redirect("/?connect=true");
    }
  }, [connected]);

  return <>{children}</>;
}
