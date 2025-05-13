"use client";

import { PublicKey } from "@solana/web3.js";

// Define a constant for the program ID from the uploaded code
export const PROGRAM_ID = new PublicKey(
  "2BkHiWJxLd91RWQWWcr97ggCsdA3PY1MTRoC9AJuZad9"
);

// Helper function to derive PDA addresses
export const getProgramAddresses = {
  // Get the platform PDA
  platform: () => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("platform")],
      PROGRAM_ID
    );
  },

  // Get the merchant PDA for a specific authority
  merchant: (authorityPublicKey: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("merchant"), authorityPublicKey.toBuffer()],
      PROGRAM_ID
    );
  },

  // Get the affiliate program PDA for a merchant
  affiliateProgram: (merchantPublicKey: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("affiliate_program"), merchantPublicKey.toBuffer()],
      PROGRAM_ID
    );
  },

  // Get the referral link PDA for a referrer and affiliate program
  referralLink: (
    affiliateProgramPublicKey: PublicKey,
    referrerPublicKey: PublicKey
  ) => {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("referral_link"),
        affiliateProgramPublicKey.toBuffer(),
        referrerPublicKey.toBuffer(),
      ],
      PROGRAM_ID
    );
  },
};

// Types based on the Reflink program accounts

export interface Platform {
  authority: PublicKey;
  feeBasisPoints: number;
  bump: number;
  publicKey?: PublicKey;
}

export interface Merchant {
  authority: PublicKey;
  name: string;
  isActive: boolean;
  bump: number;
  publicKey?: PublicKey;
}

export interface AffiliateProgram {
  merchant: PublicKey;
  name: string;
  referrerFeeBasisPoints: number;
  isActive: boolean;
  bump: number;
  publicKey?: PublicKey;
}

export interface ReferralLink {
  affiliateProgram: PublicKey;
  referrer: PublicKey;
  code: string;
  clickCount: number;
  conversionCount: number;
  totalSales: number;
  totalCommission: number;
  isActive: boolean;
  bump: number;
  publicKey?: PublicKey;
}

// Input types for mutations

export interface CreateAffiliateProgramInput {
  merchantPda: PublicKey;
  programName: string;
  referrerFeeBasisPoints: number;
}

export interface CreateReferralLinkInput {
  affiliateProgramPda: PublicKey;
  uniqueCode: string;
}

export interface ToggleAffiliateProgramStatusInput {
  affiliateProgramPda: PublicKey;
  merchantPda: PublicKey;
}

export interface ProcessSaleInput {
  platformPda: PublicKey;
  merchantPda: PublicKey;
  affiliateProgramPda: PublicKey;
  referralLinkPda: PublicKey;
  buyerTokenAccount: PublicKey;
  merchantTokenAccount: PublicKey;
  referrerTokenAccount: PublicKey;
  platformTokenAccount: PublicKey;
  amount: number;
}
