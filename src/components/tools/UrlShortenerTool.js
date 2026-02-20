"use client";

import { useMemo, useState } from "react";

export default function UrlShortenerTool() {
  const [url, setUrl] = useState("");
  const [useExpiry, setUseExpiry] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState(null);

  const apiBase = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

  async function readJsonSafe(res) {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  const shortUrl = useMemo(() => {
    if (!result?.shortPath) return "";
    const base =
      apiBase ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    if (!base) return result.shortPath;
    return `${base}${result.shortPath}`;
  }, [result, apiBase]);

  async function fetchStats(slug) {
    const res = await fetch(
      `${apiBase}/api/url-shortener?slug=${encodeURIComponent(slug)}`
    );
    if (!res.ok) return;
    const data = await readJsonSafe(res);
    if (!data) return;
    setStats(data);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setStats(null);
    setLoading(true);
    try {
      const payload = {
        url,
        expiresAt: useExpiry && expiresAt ? new Date(expiresAt).toISOString() : null,
      };
      const res = await fetch(`${apiBase}/api/url-shortener`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await readJsonSafe(res);
      if (!res.ok) {
        if (res.status === 404) {
          setError(
            "URL shortener backend is not configured (404). If you're using cPanel static hosting, route /api/* to the Cloudflare Worker. For local dev, run the Worker and set NEXT_PUBLIC_API_BASE_URL."
          );
          return;
        }
        setError(data?.error || "Failed to shorten link.");
        return;
      }
      if (!data) {
        setError("Failed to shorten link.");
        return;
      }
      setResult(data);
      fetchStats(data.slug);
    } catch {
      setError("Failed to shorten link.");
    } finally {
      setLoading(false);
    }
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Long URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/some/long/path"
            className="w-full rounded-xl border border-black/[.08] bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/[.08] dark:border-white/[.145]"
            inputMode="url"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="useExpiry"
            type="checkbox"
            checked={useExpiry}
            onChange={(e) => setUseExpiry(e.target.checked)}
          />
          <label htmlFor="useExpiry" className="text-sm">
            Set an expiry (optional)
          </label>
        </div>

        {useExpiry ? (
          <div className="space-y-2">
            <label className="text-sm font-medium">Expiry date/time</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-xl border border-black/[.08] bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/[.08] dark:border-white/[.145]"
            />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create short link"}
        </button>

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}
      </form>

      {result ? (
        <div className="space-y-3 rounded-xl border border-black/[.08] p-4 dark:border-white/[.145]">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Short link
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={apiBase ? `${apiBase}${result.shortPath}` : result.shortPath}
                className="break-all text-sm font-medium hover:underline"
              >
                {shortUrl}
              </a>
              <button
                type="button"
                onClick={() => copy(shortUrl)}
                className="rounded-full border border-black/[.08] px-4 py-2 text-sm hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
              >
                Copy
              </button>
            </div>
          </div>

          {stats ? (
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              <p>
                Clicks: <span className="font-medium">{stats.clicks}</span>
              </p>
              {stats.expiresAt ? (
                <p>Expires: {new Date(stats.expiresAt).toLocaleString()}</p>
              ) : (
                <p>Expires: Never</p>
              )}
              <button
                type="button"
                onClick={() => fetchStats(result.slug)}
                className="mt-2 rounded-full border border-black/[.08] px-3 py-1 text-xs hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
              >
                Refresh clicks
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Custom slugs and branded domains can be added later.
      </p>
    </div>
  );
}
