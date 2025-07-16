import { Metadata } from "next";

import { Inter } from "next/font/google";
import { BaseLayout } from "@/components/layouts/BaseLayout";
import { Toaster } from "@/components/ui/toast";

import Providers from "./providers";

import "@solana/wallet-adapter-react-ui/styles.css";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Reflink | Direct Merchant-Affiliate Platform on Solana",
  description:
    "Connect merchants and affiliates directly with automated commission distribution and instant SOL payouts on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M5SGHGFZ');`,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${inter.variable} antialiased min-h-screen bg-gray-900 text-white`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M5SGHGFZ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Providers>
          <BaseLayout>{children}</BaseLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
