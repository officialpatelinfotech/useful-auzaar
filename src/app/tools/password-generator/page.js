"use client";

import { useEffect } from "react";

export default function ToolsPasswordRedirect() {
  useEffect(() => {
    window.location.replace("/password-generator");
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Redirecting…</p>
      <a className="text-sm hover:underline" href="/password-generator">
        Go to Password Generator
      </a>
    </div>
  );
}
