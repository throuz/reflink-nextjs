"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gray-900 group-[.toaster]:text-gray-50 group-[.toaster]:border-gray-800 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-400",
          actionButton:
            "group-[.toast]:bg-indigo-500 group-[.toast]:text-gray-50",
          cancelButton:
            "group-[.toast]:bg-gray-700 group-[.toast]:text-gray-50",
        },
      }}
      {...props}
    />
  );
}
