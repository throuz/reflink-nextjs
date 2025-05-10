import { useEffect, useState } from "react";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { useProgram } from "./useProgram";

export function useAffiliate() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const [affiliateData, setAffiliateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!program || !publicKey) {
      setLoading(false);
      return;
    }

    const fetchAffiliateData = async () => {
      try {
        const [affiliatePda] = PublicKey.findProgramAddressSync(
          [Buffer.from("affiliate"), publicKey.toBuffer()],
          program.programId
        );

        const affiliate = await program.account.affiliate.fetch(affiliatePda);
        setAffiliateData(affiliate);
      } catch (error) {
        console.error("Error fetching affiliate data:", error);
        setAffiliateData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAffiliateData();
  }, [program, publicKey]);

  return { affiliateData, loading };
}
