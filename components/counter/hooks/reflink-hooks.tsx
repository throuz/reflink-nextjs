"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useProgram } from "./useProgram";
import { PROGRAM_ID } from "@/constants";

// Platform Hooks

/**
 * Hook to fetch the platform account data
 */
export function usePlatform() {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["platform"],
    queryFn: async () => {
      const [platformPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("platform")],
        PROGRAM_ID
      );

      try {
        const platformAccount = await program.account.platform.fetch(
          platformPda
        );
        return {
          ...platformAccount,
          publicKey: platformPda,
        };
      } catch (error) {
        console.error("Error fetching platform:", error);
        throw error;
      }
    },
  });
}

/**
 * Hook to initialize the platform
 */
export function useInitializePlatform() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (feeBasisPoints: number) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const [platformPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("platform")],
        PROGRAM_ID
      );

      const tx = await program.methods
        .initializePlatform(feeBasisPoints)
        .accounts({
          platform: platformPda,
          authority: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform"] });
    },
  });
}

/**
 * Hook to update the platform fee
 */
export function useUpdatePlatformFee() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFeeBasisPoints: number) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const [platformPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("platform")],
        PROGRAM_ID
      );

      const tx = await program.methods
        .updatePlatformFee(newFeeBasisPoints)
        .accounts({
          platform: platformPda,
          authority: publicKey,
        })
        .rpc();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform"] });
    },
  });
}

// Merchant Hooks

/**
 * Hook to fetch a merchant account
 */
export function useMerchant(authorityPublicKey?: PublicKey) {
  const { program, publicKey } = useProgram();
  const merchantAuthority = authorityPublicKey || publicKey;

  return useQuery({
    queryKey: ["merchant", merchantAuthority?.toString()],
    queryFn: async () => {
      if (!merchantAuthority) throw new Error("No merchant authority provided");

      const [merchantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merchant"), merchantAuthority.toBuffer()],
        PROGRAM_ID
      );

      try {
        const merchantAccount = await program.account.merchant.fetch(
          merchantPda
        );
        return {
          ...merchantAccount,
          publicKey: merchantPda,
        };
      } catch (error) {
        console.error("Error fetching merchant:", error);
        throw error;
      }
    },
    enabled: !!merchantAuthority,
  });
}

/**
 * Hook to create a merchant account
 */
export function useCreateMerchant() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (merchantName: string) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const [merchantPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("merchant"), publicKey.toBuffer()],
        PROGRAM_ID
      );

      const tx = await program.methods
        .createMerchant(merchantName)
        .accounts({
          merchant: merchantPda,
          authority: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: (_, __, { publicKey }) => {
      queryClient.invalidateQueries({
        queryKey: ["merchant", publicKey?.toString()],
      });
    },
  });
}

/**
 * Hook to toggle a merchant's active status
 */
export function useToggleMerchantStatus() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (merchantPda: PublicKey) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const tx = await program.methods
        .toggleMerchantStatus()
        .accounts({
          merchant: merchantPda,
          authority: publicKey,
        })
        .rpc();

      return tx;
    },
    onSuccess: (_, merchantPda) => {
      queryClient.invalidateQueries({
        queryKey: ["merchant", merchantPda.toString()],
      });
    },
  });
}

/**
 * Hook to fetch all merchants
 */
export function useAllMerchants() {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["merchants"],
    queryFn: async () => {
      try {
        const merchants = await program.account.merchant.all();
        return merchants.map((m) => ({
          ...m.account,
          publicKey: m.publicKey,
        }));
      } catch (error) {
        console.error("Error fetching merchants:", error);
        throw error;
      }
    },
  });
}

// Affiliate Program Hooks

/**
 * Hook to fetch an affiliate program
 */
export function useAffiliateProgram(merchantPublicKey?: PublicKey) {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["affiliateProgram", merchantPublicKey?.toString()],
    queryFn: async () => {
      if (!merchantPublicKey)
        throw new Error("No merchant public key provided");

      const [affiliateProgramPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("affiliate_program"), merchantPublicKey.toBuffer()],
        PROGRAM_ID
      );

      try {
        const affiliateProgramAccount =
          await program.account.affiliateProgram.fetch(affiliateProgramPda);
        return {
          ...affiliateProgramAccount,
          publicKey: affiliateProgramPda,
        };
      } catch (error) {
        console.error("Error fetching affiliate program:", error);
        throw error;
      }
    },
    enabled: !!merchantPublicKey,
  });
}

/**
 * Hook to create an affiliate program
 */
export function useCreateAffiliateProgram() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      merchantPda,
      programName,
      referrerFeeBasisPoints,
    }: {
      merchantPda: PublicKey;
      programName: string;
      referrerFeeBasisPoints: number;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const [affiliateProgramPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("affiliate_program"), merchantPda.toBuffer()],
        PROGRAM_ID
      );

      const tx = await program.methods
        .createAffiliateProgram(programName, referrerFeeBasisPoints)
        .accounts({
          affiliateProgram: affiliateProgramPda,
          merchant: merchantPda,
          authority: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: (_, { merchantPda }) => {
      queryClient.invalidateQueries({
        queryKey: ["affiliateProgram", merchantPda.toString()],
      });
    },
  });
}

/**
 * Hook to toggle an affiliate program's active status
 */
export function useToggleAffiliateProgramStatus() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      affiliateProgramPda,
      merchantPda,
    }: {
      affiliateProgramPda: PublicKey;
      merchantPda: PublicKey;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const tx = await program.methods
        .toggleAffiliateProgramStatus()
        .accounts({
          affiliateProgram: affiliateProgramPda,
          merchant: merchantPda,
          authority: publicKey,
        })
        .rpc();

      return tx;
    },
    onSuccess: (_, { affiliateProgramPda }) => {
      queryClient.invalidateQueries({
        queryKey: ["affiliateProgram", affiliateProgramPda.toString()],
      });
    },
  });
}

/**
 * Hook to fetch all affiliate programs
 */
export function useAllAffiliatePrograms() {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["affiliatePrograms"],
    queryFn: async () => {
      try {
        const affiliatePrograms = await program.account.affiliateProgram.all();
        return affiliatePrograms.map((p) => ({
          ...p.account,
          publicKey: p.publicKey,
        }));
      } catch (error) {
        console.error("Error fetching affiliate programs:", error);
        throw error;
      }
    },
  });
}

// Referral Link Hooks

/**
 * Hook to fetch a referral link
 */
export function useReferralLink(
  affiliateProgramPublicKey?: PublicKey,
  referrerPublicKey?: PublicKey
) {
  const { program, publicKey } = useProgram();
  const referrer = referrerPublicKey || publicKey;

  return useQuery({
    queryKey: [
      "referralLink",
      affiliateProgramPublicKey?.toString(),
      referrer?.toString(),
    ],
    queryFn: async () => {
      if (!affiliateProgramPublicKey || !referrer)
        throw new Error("Missing affiliate program or referrer");

      const [referralLinkPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("referral_link"),
          affiliateProgramPublicKey.toBuffer(),
          referrer.toBuffer(),
        ],
        PROGRAM_ID
      );

      try {
        const referralLinkAccount = await program.account.referralLink.fetch(
          referralLinkPda
        );
        return {
          ...referralLinkAccount,
          publicKey: referralLinkPda,
        };
      } catch (error) {
        console.error("Error fetching referral link:", error);
        throw error;
      }
    },
    enabled: !!affiliateProgramPublicKey && !!referrer,
  });
}

/**
 * Hook to create a referral link
 */
export function useCreateReferralLink() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      affiliateProgramPda,
      uniqueCode,
    }: {
      affiliateProgramPda: PublicKey;
      uniqueCode: string;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const [referralLinkPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("referral_link"),
          affiliateProgramPda.toBuffer(),
          publicKey.toBuffer(),
        ],
        PROGRAM_ID
      );

      const tx = await program.methods
        .createReferralLink(uniqueCode)
        .accounts({
          referralLink: referralLinkPda,
          affiliateProgram: affiliateProgramPda,
          referrer: publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      return tx;
    },
    onSuccess: (_, { affiliateProgramPda }) => {
      queryClient.invalidateQueries({
        queryKey: ["referralLink", affiliateProgramPda.toString()],
      });
    },
  });
}

/**
 * Hook to toggle a referral link's active status
 */
export function useToggleReferralLinkStatus() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (referralLinkPda: PublicKey) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const tx = await program.methods
        .toggleReferralLinkStatus()
        .accounts({
          referralLink: referralLinkPda,
          authority: publicKey,
        })
        .rpc();

      return tx;
    },
    onSuccess: (_, referralLinkPda) => {
      queryClient.invalidateQueries({
        queryKey: ["referralLink", referralLinkPda.toString()],
      });
    },
  });
}

/**
 * Hook to track a click on a referral link
 */
export function useIncrementClick() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (referralLinkPda: PublicKey) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const tx = await program.methods
        .incrementClick()
        .accounts({
          referralLink: referralLinkPda,
          authority: publicKey,
        })
        .rpc();

      return tx;
    },
    onSuccess: (_, referralLinkPda) => {
      queryClient.invalidateQueries({
        queryKey: ["referralLink", referralLinkPda.toString()],
      });
    },
  });
}

/**
 * Hook to fetch all referral links
 */
export function useAllReferralLinks() {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["referralLinks"],
    queryFn: async () => {
      try {
        const referralLinks = await program.account.referralLink.all();
        return referralLinks.map((link) => ({
          ...link.account,
          publicKey: link.publicKey,
        }));
      } catch (error) {
        console.error("Error fetching referral links:", error);
        throw error;
      }
    },
  });
}

/**
 * Hook to fetch referral links for a specific referrer
 */
export function useReferrerLinks(referrerPublicKey?: PublicKey) {
  const { program, publicKey } = useProgram();
  const referrer = referrerPublicKey || publicKey;

  return useQuery({
    queryKey: ["referrerLinks", referrer?.toString()],
    queryFn: async () => {
      if (!referrer) throw new Error("No referrer provided");

      try {
        const referralLinks = await program.account.referralLink.all([
          {
            memcmp: {
              offset: 8 + 32, // discriminator + affiliate_program
              bytes: referrer.toBase58(),
            },
          },
        ]);

        return referralLinks.map((link) => ({
          ...link.account,
          publicKey: link.publicKey,
        }));
      } catch (error) {
        console.error("Error fetching referrer links:", error);
        throw error;
      }
    },
    enabled: !!referrer,
  });
}

/**
 * Hook to process a sale
 */
export function useProcessSale() {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      platformPda,
      merchantPda,
      affiliateProgramPda,
      referralLinkPda,
      buyerTokenAccount,
      merchantTokenAccount,
      referrerTokenAccount,
      platformTokenAccount,
      amount,
    }: {
      platformPda: PublicKey;
      merchantPda: PublicKey;
      affiliateProgramPda: PublicKey;
      referralLinkPda: PublicKey;
      buyerTokenAccount: PublicKey;
      merchantTokenAccount: PublicKey;
      referrerTokenAccount: PublicKey;
      platformTokenAccount: PublicKey;
      amount: number;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");

      const tx = await program.methods
        .processSale(new anchor.BN(amount))
        .accounts({
          platform: platformPda,
          merchant: merchantPda,
          affiliateProgram: affiliateProgramPda,
          referralLink: referralLinkPda,
          buyer: publicKey,
          buyerTokenAccount,
          merchantTokenAccount,
          referrerTokenAccount,
          platformTokenAccount,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        })
        .rpc();

      return tx;
    },
    onSuccess: (_, { referralLinkPda }) => {
      queryClient.invalidateQueries({
        queryKey: ["referralLink", referralLinkPda.toString()],
      });
    },
  });
}
