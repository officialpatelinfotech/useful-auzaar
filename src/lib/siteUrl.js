export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    (process.env.NODE_ENV === "production" ? "https://usefulauzaar.in" : "") ||
    "http://localhost:3000";

  try {
    const normalized = raw.startsWith("http") ? raw : `https://${raw}`;
    return new URL(normalized).origin;
  } catch {
    return "http://localhost:3000";
  }
}
