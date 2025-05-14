"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserRole } from "@/components/counter/hooks/useReflink";
import { useMemo } from "react";

export function NavLinks() {
  const pathname = usePathname();
  const { data: userRole } = useUserRole();

  const navigationItems = useMemo(
    () => [
      { name: "Home", href: "/" },
      ...(userRole?.isMerchant || userRole?.isAffiliate
        ? [
            {
              name: "Dashboard",
              href: userRole.isMerchant
                ? "/dashboard/merchant"
                : "/dashboard/affiliate",
            },
          ]
        : [{ name: "Register", href: "/register" }]),
    ],
    [userRole?.isMerchant, userRole?.isAffiliate]
  );

  return (
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
  );
}
