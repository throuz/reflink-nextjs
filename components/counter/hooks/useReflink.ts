import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./useProgram";
import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";

// Helper function to find PDAs
const findMerchantPDA = async (authority: PublicKey, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("merchant"), authority.toBuffer()],
    programId
  );
};

const findAffiliatePDA = async (authority: PublicKey, programId: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("affiliate"), authority.toBuffer()],
    programId
  );
};

const findAffiliateMerchantPDA = async (
  affiliate: PublicKey,
  merchant: PublicKey,
  programId: PublicKey
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("affiliate-merchant"),
      affiliate.toBuffer(),
      merchant.toBuffer(),
    ],
    programId
  );
};

// Merchant Hooks
export const useRegisterMerchant = () => {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      commissionRate,
      websiteUrl,
    }: {
      name: string;
      commissionRate: number;
      websiteUrl: string;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");
      if (!program) throw new Error("Program not initialized");

      const [merchantPDA] = await findMerchantPDA(publicKey, program.programId);

      return program.methods
        .registerMerchant(name, commissionRate, websiteUrl)
        .accounts({
          authority: publicKey,
          merchant: merchantPDA,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
    },
  });
};

export const useUpdateMerchant = () => {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      commissionRate,
      websiteUrl,
      isActive,
    }: {
      name?: string;
      commissionRate?: number;
      websiteUrl?: string;
      isActive?: boolean;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");
      if (!program) throw new Error("Program not initialized");

      const [merchantPDA] = await findMerchantPDA(publicKey, program.programId);

      return program.methods
        .updateMerchant(
          name ?? null,
          commissionRate ?? null,
          websiteUrl ?? null,
          isActive ?? null
        )
        .accounts({
          authority: publicKey,
          merchant: merchantPDA,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
    },
  });
};

export const useMerchant = (authority?: PublicKey) => {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["merchant", authority?.toBase58()],
    queryFn: async () => {
      if (!authority || !program) throw new Error("Invalid parameters");

      const [merchantPDA] = await findMerchantPDA(authority, program.programId);
      return program.account.merchant.fetch(merchantPDA);
    },
    enabled: !!authority && !!program,
  });
};

// Affiliate Hooks
export const useRegisterAffiliate = () => {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      if (!publicKey) throw new Error("Wallet not connected");
      if (!program) throw new Error("Program not initialized");

      const [affiliatePDA] = await findAffiliatePDA(
        publicKey,
        program.programId
      );

      return program.methods
        .registerAffiliate(name)
        .accounts({
          authority: publicKey,
          affiliate: affiliatePDA,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate"] });
    },
  });
};

export const useUpdateAffiliate = () => {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name?: string }) => {
      if (!publicKey) throw new Error("Wallet not connected");
      if (!program) throw new Error("Program not initialized");

      const [affiliatePDA] = await findAffiliatePDA(
        publicKey,
        program.programId
      );

      return program.methods
        .updateAffiliate(name ?? null)
        .accounts({
          authority: publicKey,
          affiliate: affiliatePDA,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate"] });
    },
  });
};

export const useAffiliate = (authority?: PublicKey) => {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["affiliate", authority?.toBase58()],
    queryFn: async () => {
      if (!authority || !program) throw new Error("Invalid parameters");

      const [affiliatePDA] = await findAffiliatePDA(
        authority,
        program.programId
      );
      return program.account.affiliate.fetch(affiliatePDA);
    },
    enabled: !!authority && !!program,
  });
};

// Affiliate-Merchant Relationship Hooks
export const useJoinMerchant = () => {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      merchantAuthority,
    }: {
      merchantAuthority: PublicKey;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");
      if (!program) throw new Error("Program not initialized");

      const [affiliatePDA] = await findAffiliatePDA(
        publicKey,
        program.programId
      );
      const [merchantPDA] = await findMerchantPDA(
        merchantAuthority,
        program.programId
      );
      const [affiliateMerchantPDA] = await findAffiliateMerchantPDA(
        affiliatePDA,
        merchantPDA,
        program.programId
      );

      return program.methods
        .joinMerchant()
        .accounts({
          authority: publicKey,
          affiliate: affiliatePDA,
          merchant: merchantPDA,
          affiliateMerchant: affiliateMerchantPDA,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliateMerchant"] });
    },
  });
};

export const useAffiliateMerchant = (
  affiliateAuthority?: PublicKey,
  merchantAuthority?: PublicKey
) => {
  const { program } = useProgram();

  return useQuery({
    queryKey: [
      "affiliateMerchant",
      affiliateAuthority?.toBase58(),
      merchantAuthority?.toBase58(),
    ],
    queryFn: async () => {
      if (!affiliateAuthority || !merchantAuthority || !program)
        throw new Error("Invalid parameters");

      const [affiliatePDA] = await findAffiliatePDA(
        affiliateAuthority,
        program.programId
      );
      const [merchantPDA] = await findMerchantPDA(
        merchantAuthority,
        program.programId
      );
      const [affiliateMerchantPDA] = await findAffiliateMerchantPDA(
        affiliatePDA,
        merchantPDA,
        program.programId
      );

      return program.account.affiliateMerchant.fetch(affiliateMerchantPDA);
    },
    enabled: !!affiliateAuthority && !!merchantAuthority && !!program,
  });
};

// Purchase Hook
export const useProcessPurchase = () => {
  const { program, publicKey } = useProgram();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      amount,
      merchantAuthority,
      affiliateAuthority,
    }: {
      amount: number;
      merchantAuthority: PublicKey;
      affiliateAuthority: PublicKey;
    }) => {
      if (!publicKey) throw new Error("Wallet not connected");
      if (!program) throw new Error("Program not initialized");

      const [merchantPDA] = await findMerchantPDA(
        merchantAuthority,
        program.programId
      );
      const [affiliatePDA] = await findAffiliatePDA(
        affiliateAuthority,
        program.programId
      );
      const [affiliateMerchantPDA] = await findAffiliateMerchantPDA(
        affiliatePDA,
        merchantPDA,
        program.programId
      );

      return program.methods
        .processPurchase(new BN(amount))
        .accounts({
          customer: publicKey,
          merchant: merchantPDA,
          affiliate: affiliatePDA,
          affiliateMerchant: affiliateMerchantPDA,
          merchantAuthority,
          affiliateAuthority,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      queryClient.invalidateQueries({ queryKey: ["affiliate"] });
      queryClient.invalidateQueries({ queryKey: ["affiliateMerchant"] });
    },
  });
};

// Get all merchants
export const useAllMerchants = () => {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["allMerchants"],
    queryFn: async () => {
      if (!program) throw new Error("Program not initialized");

      const merchants = await program.account.merchant.all();
      return merchants.map((merchant) => ({
        ...merchant.account,
        publicKey: merchant.publicKey,
      }));
    },
    enabled: !!program,
  });
};

// Get all affiliates
export const useAllAffiliates = () => {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["allAffiliates"],
    queryFn: async () => {
      if (!program) throw new Error("Program not initialized");

      const affiliates = await program.account.affiliate.all();
      return affiliates.map((affiliate) => ({
        ...affiliate.account,
        publicKey: affiliate.publicKey,
      }));
    },
    enabled: !!program,
  });
};

// Get all affiliates for a specific merchant
export const useMerchantAffiliates = (merchantAuthority?: PublicKey) => {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["merchantAffiliates", merchantAuthority?.toBase58()],
    queryFn: async () => {
      if (!merchantAuthority || !program) throw new Error("Invalid parameters");

      // Get merchant PDA
      const [merchantPDA] = await findMerchantPDA(
        merchantAuthority,
        program.programId
      );

      // Get all affiliate-merchant relationships
      const relationships = await program.account.affiliateMerchant.all([
        {
          memcmp: {
            offset: 8, // Skip discriminator
            bytes: merchantPDA.toBase58(),
          },
        },
      ]);

      // Get affiliate details for each relationship
      const affiliates = await Promise.all(
        relationships.map(async (relationship) => {
          const affiliateAccount = await program.account.affiliate.fetch(
            relationship.account.affiliate
          );
          return {
            ...affiliateAccount,
            publicKey: relationship.account.affiliate,
            relationship: {
              ...relationship.account,
              publicKey: relationship.publicKey,
            },
          };
        })
      );

      return affiliates;
    },
    enabled: !!merchantAuthority && !!program,
  });
};

// Get all merchants for a specific affiliate
export const useAffiliateMerchants = (affiliateAuthority?: PublicKey) => {
  const { program } = useProgram();

  return useQuery({
    queryKey: ["affiliateMerchants", affiliateAuthority?.toBase58()],
    queryFn: async () => {
      if (!affiliateAuthority || !program)
        throw new Error("Invalid parameters");

      // Get affiliate PDA
      const [affiliatePDA] = await findAffiliatePDA(
        affiliateAuthority,
        program.programId
      );

      // Get all affiliate-merchant relationships
      const relationships = await program.account.affiliateMerchant.all([
        {
          memcmp: {
            offset: 8 + 32, // Skip discriminator and merchant pubkey
            bytes: affiliatePDA.toBase58(),
          },
        },
      ]);

      // Get merchant details for each relationship
      const merchants = await Promise.all(
        relationships.map(async (relationship) => {
          const merchantAccount = await program.account.merchant.fetch(
            relationship.account.merchant
          );
          return {
            ...merchantAccount,
            publicKey: relationship.account.merchant,
            relationship: {
              ...relationship.account,
              publicKey: relationship.publicKey,
            },
          };
        })
      );

      return merchants;
    },
    enabled: !!affiliateAuthority && !!program,
  });
};

// User Role Hook
export const useUserRole = () => {
  const { program, publicKey } = useProgram();

  return useQuery({
    queryKey: ["userRole", publicKey?.toBase58()],
    queryFn: async () => {
      if (!publicKey || !program) throw new Error("Wallet not connected");

      try {
        // Check if user is a merchant
        const [merchantPDA] = await findMerchantPDA(
          publicKey,
          program.programId
        );
        const merchantAccount = await program.account.merchant.fetch(
          merchantPDA
        );

        return {
          isMerchant: true,
          isAffiliate: false,
          merchantAccount,
          merchantPDA,
        };
      } catch (error) {
        try {
          // Check if user is an affiliate
          const [affiliatePDA] = await findAffiliatePDA(
            publicKey,
            program.programId
          );
          const affiliateAccount = await program.account.affiliate.fetch(
            affiliatePDA
          );

          return {
            isMerchant: false,
            isAffiliate: true,
            affiliateAccount,
            affiliatePDA,
          };
        } catch (error) {
          // User is neither merchant nor affiliate
          return {
            isMerchant: false,
            isAffiliate: false,
          };
        }
      }
    },
    enabled: !!publicKey && !!program,
  });
};
