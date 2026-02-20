"use client";

import { useEffect } from "react";

export default function ToolsUrlShortenerRedirect() {
  useEffect(() => {
    window.location.replace("/url-shortener");
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Redirecting…</p>
      <a className="text-sm hover:underline" href="/url-shortener">
        Go to URL Shortener
      </a>
    </div>
  );
}
