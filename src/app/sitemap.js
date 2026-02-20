import { getSiteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

export default function sitemap() {
  const base = getSiteUrl();
  const lastModified = new Date();

  const paths = [
    "/",
    "/url-shortener",
    "/shorten-link",
    "/create-short-url",
    "/qr-code-generator",
    "/generate-qr-code",
    "/whatsapp-qr-code",
    "/password-generator",
    "/strong-password-generator",
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
