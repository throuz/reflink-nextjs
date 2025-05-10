"use client";

import { toast } from "sonner";
import * as anchor from "@coral-xyz/anchor";

export function useToast() {
  const showSuccessToast = (message: string, tx?: string) => {
    toast.success(message, {
      description: tx ? `Transaction: ${tx}` : undefined,
      action: tx
        ? {
            label: "View Transaction",
            onClick: () =>
              window.open(`https://explorer.solana.com/tx/${tx}`, "_blank"),
          }
        : undefined,
    });
  };

  const showErrorToast = (message: string, error?: Error) => {
    toast.error(message, {
      description: error?.message,
    });
  };

  return {
    showSuccessToast,
    showErrorToast,
  };
}
