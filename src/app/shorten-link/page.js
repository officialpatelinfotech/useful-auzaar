import ToolPageShell from "@/components/ToolPageShell";
import UrlShortenerTool from "@/components/tools/UrlShortenerTool";

export const metadata = {
  title: "Shorten a Link Online – Fast Free Link Shortener",
  description:
    "Shorten a link online for free. Create a short URL, share it anywhere, and track clicks automatically.",
  alternates: { canonical: "/shorten-link" },
};

export default function ShortenLinkPage() {
  return (
    <ToolPageShell
      h1="Shorten a Link Online – Fast Free Link Shortener"
      intro="Need to shorten a link quickly? Paste your URL and generate a short link you can share on social media, messages, and print."
      explanationTitle="Shorten links without the clutter"
      explanationParagraphs={[
        "When you shorten a link, you’re turning a long URL into something that’s easier to copy, remember, and share. This is especially helpful on platforms where long links look messy, break across lines, or distract from your message. A short link keeps your text clean while still taking visitors to the same destination.",
        "This page uses the same core URL shortener engine: a short slug is generated and stored alongside your original destination. When a visitor opens the short link, the redirect route looks up the destination and forwards them immediately. Because the redirect is server-side, it’s fast and works reliably across devices.",
        "Click count tracking is automatic. Each time someone opens the short URL, we increment a counter. That makes it easy to sanity-check whether a campaign is getting attention, whether a QR code is being scanned, or whether a link shared in a group chat is actually being used.",
        "If you want a link to stop working after a particular time—like a limited-time offer or a temporary download—you can set an expiry. On redirect, we check that expiry and refuse expired links. This keeps your audience from landing on outdated pages and helps you manage time-sensitive content without manual cleanup.",
        "For SEO, the most useful tool pages are simple: a clear H1, a short intro, the tool itself, and an explanation that answers the common questions people have before they trust and use the tool. The goal is to be helpful first, and indexable second. Internal links to other tools make navigation easy and help search engines understand the site structure.",
        "As UsefulAuzaar grows, you’ll see more link features added carefully—without slowing down the basics. Custom slugs, branded domains, bulk shortening, and team dashboards are natural upgrades. But for now, speed and simplicity win: shorten your link and keep moving.",
      ]}
      faq={[
        {
          q: "Can I shorten multiple links?",
          a: "Yes—create as many short links as you want. Each link gets its own slug and click count.",
        },
        {
          q: "Is it really free?",
          a: "Yes. Monetization is planned later, but this MVP is free and intentionally lightweight.",
        },
        {
          q: "Why is my link showing as expired?",
          a: "If you set an expiry and the time has passed, the redirect will stop working. Create a new link if needed.",
        },
        {
          q: "Can I edit the destination later?",
          a: "Not in this MVP. Link editing and management dashboards are future upgrades.",
        },
      ]}
      relatedLinks={[
        { href: "/qr-code-generator", label: "QR Code Generator" },
        { href: "/password-generator", label: "Password Generator" },
        { href: "/url-shortener", label: "URL Shortener" },
      ]}
    >
      <UrlShortenerTool />
    </ToolPageShell>
  );
}
