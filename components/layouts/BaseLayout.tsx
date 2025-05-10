"use client";

import { PropsWithChildren } from "react";
import { Toaster } from "@/components/ui/sonner";
import { WalletButton } from "../counter/WalletButton";
import { SolanaProvider } from "../counter/provider/Solana";

export function BaseLayout({ children }: PropsWithChildren) {
  return (
    <SolanaProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/75 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2">
                <img src="/logo.svg" alt="Reflink" className="h-8 w-8" />
                <span className="text-xl font-bold text-white">Reflink</span>
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <WalletButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">{children}</main>

        <footer className="border-t border-gray-800 bg-gray-900 py-8">
          <div className="container mx-auto px-4 text-center text-gray-400">
            <p>© 2025 Reflink. All rights reserved.</p>
          </div>
        </footer>
      </div>
      <Toaster />
    </SolanaProvider>
  );
}
