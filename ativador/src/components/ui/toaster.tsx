"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      toastOptions={{
        style: { background: "#fff", border: "1px solid #e2e8f0", color: "#1a1a1a" },
      }}
    />
  )
}
