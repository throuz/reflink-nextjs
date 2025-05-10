import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider } from "@project-serum/anchor";
import { useEffect, useState } from "react";
import { useProgram } from "./useProgram";
import { PublicKey } from "@solana/web3.js";

export function useReferrals() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!program || !publicKey) {
      setLoading(false);
      return;
    }

    const fetchReferrals = async () => {
      try {
        // Fetch all referrals for the connected wallet
        const referralAccounts = await program.account.referral.all([
          {
            memcmp: {
              offset: 8, // After discriminator
              bytes: publicKey.toBase58(),
            },
          },
        ]);

        setReferrals(referralAccounts);
      } catch (error) {
        console.error("Error fetching referrals:", error);
        setReferrals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, [program, publicKey]);

  const createReferral = async (
    merchantPublicKey: PublicKey,
    amount: number,
    isToken = false,
    tokenMint?: PublicKey
  ) => {
    if (!program || !publicKey) throw new Error("Wallet not connected");

    const [affiliatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("affiliate"), publicKey.toBuffer()],
      program.programId
    );

    const affiliate = await program.account.affiliate.fetch(affiliatePda);
    const referralNumber = affiliate.totalReferrals;

    const [referralPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("referral"),
        affiliatePda.toBuffer(),
        merchantPublicKey.toBuffer(),
        referralNumber.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    if (isToken && !tokenMint) {
      throw new Error("Token mint required for token referrals");
    }

    if (isToken) {
      return program.methods.registerReferralToken(new BN(amount)).accounts({
        referral: referralPda,
        affiliate: affiliatePda,
        merchant: merchantPublicKey,
        tokenMint,
        // Add other required accounts...
      });
    } else {
      return program.methods.registerReferralSol(new BN(amount)).accounts({
        referral: referralPda,
        affiliate: affiliatePda,
        merchant: merchantPublicKey,
        // Add other required accounts...
      });
    }
  };

  return { referrals, loading, createReferral };
}
