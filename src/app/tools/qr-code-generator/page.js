"use client";

import { useEffect } from "react";

export default function ToolsQrCodeRedirect() {
  useEffect(() => {
    window.location.replace("/qr-code-generator");
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Redirecting…</p>
      <a className="text-sm hover:underline" href="/qr-code-generator">
        Go to QR Code Generator
      </a>
    </div>
  );
}
