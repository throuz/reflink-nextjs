"use client";

import { PropsWithChildren } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

import { WalletButton } from "../counter/WalletButton";
import { SolanaProvider } from "../counter/provider/Solana";

export function BaseLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  const footerLinks = {
    Resources: [
      { name: "Documentation", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
    Community: [
      { name: "X", href: "https://x.com" },
      { name: "Discord", href: "https://discord.com" },
      { name: "GitHub", href: "https://github.com" },
    ],
  };

  return (
    <SolanaProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/75 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="flex items-center space-x-2 transition-opacity hover:opacity-80"
              >
                <span className="text-xl font-bold text-white">Reflink</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm transition-colors ${
                      pathname === item.href
                        ? "text-white font-medium"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <WalletButton />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-14rem)]">
          {children}
        </main>

        <footer className="border-t border-gray-800 bg-gray-900 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <Link href="/" className="flex items-center space-x-2 mb-4">
                  <span className="text-xl font-bold text-white">Reflink</span>
                </Link>
                <p className="text-gray-400 text-sm">
                  Direct merchant-affiliate platform on Solana
                </p>
              </div>
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h3 className="font-medium text-white mb-4">{category}</h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} Reflink. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
      <Toaster />
    </SolanaProvider>
  );
}
