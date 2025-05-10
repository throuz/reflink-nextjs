import { useEffect, useState } from "react";

import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

import { useProgram } from "./useProgram";

export function useMerchant() {
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const [merchantData, setMerchantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!program || !publicKey) {
      setLoading(false);
      return;
    }

    const fetchMerchantData = async () => {
      try {
        const [merchantPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("merchant"), publicKey.toBuffer()],
          program.programId
        );

        const merchant = await program.account.merchant.fetch(merchantPda);
        setMerchantData(merchant);
      } catch (error) {
        console.error("Error fetching merchant data:", error);
        setMerchantData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMerchantData();
  }, [program, publicKey]);

  return { merchantData, loading };
}
