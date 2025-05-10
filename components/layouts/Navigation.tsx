"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">Reflink</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/dashboard/merchant">
              <Button
                variant={isActive("/dashboard/merchant") ? "default" : "ghost"}
              >
                Merchant Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/affiliate">
              <Button
                variant={isActive("/dashboard/affiliate") ? "default" : "ghost"}
              >
                Affiliate Dashboard
              </Button>
            </Link>
            <Link href="/campaigns">
              <Button variant={isActive("/campaigns") ? "default" : "ghost"}>
                Browse Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
