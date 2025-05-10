"use client";

import { useEffect } from "react";

import Idl from "@/anchor-idl/idl.json";
import { Reflink } from "@/anchor-idl/idl";
import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";

interface UseProgramReturn {
  program: anchor.Program<Reflink>;
  publicKey: PublicKey | null;
  connected: boolean;
  connection: anchor.web3.Connection;
}

/**
 * A hook that provides access to the Solana program, wallet connection and status.
 * This hook handles the basic setup for the Reflink program.
 */
export function useProgram(): UseProgramReturn {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  // Program initialization - conditionally create with provider if wallet connected
  let program;
  if (wallet) {
    // Create a provider with the wallet for transaction signing
    const provider = new anchor.AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });
    program = new anchor.Program<Reflink>(Idl, provider);
  } else {
    // Create program with just connection for read-only operations
    program = new anchor.Program<Reflink>(Idl, { connection });
  }

  // Fund connected wallet with devnet SOL
  useEffect(() => {
    const airdropDevnetSol = async () => {
      if (!publicKey) return;

      try {
        const balance = await connection.getBalance(publicKey);
        const solBalance = balance / LAMPORTS_PER_SOL;

        if (solBalance < 1) {
          await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
        }
      } catch (error) {
        console.log(error);
      }
    };

    airdropDevnetSol();
  }, [publicKey, connection]);

  return {
    program,
    publicKey,
    connected,
    connection,
  };
}
