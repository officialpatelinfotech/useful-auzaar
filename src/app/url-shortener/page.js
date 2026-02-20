import ToolPageShell from "@/components/ToolPageShell";
import UrlShortenerTool from "@/components/tools/UrlShortenerTool";

export const metadata = {
  title: "Free URL Shortener – Create Short Links Instantly",
  description:
    "Create short links in seconds. Redirects work instantly, click counts are tracked, and you can optionally set an expiry time.",
  alternates: { canonical: "/url-shortener" },
};

export default function UrlShortenerPage() {
  return (
    <ToolPageShell
      h1="Free URL Shortener – Create Short Links Instantly"
      intro="Paste a long link, generate a short URL, and share it anywhere. UsefulAuzaar tracks clicks automatically and supports optional expiry for time-limited links."
      explanationTitle="How this free URL shortener works"
      explanationParagraphs={[
        "A URL shortener converts a long, messy link into a short one that’s easier to share in WhatsApp, Instagram, email, or printed materials. Under the hood, the short link is just a unique identifier (a ‘slug’) that maps to your original destination. When someone opens the short URL, our redirect handler looks up the destination and sends the visitor there instantly.",
        "For an MVP, the most important thing is reliability: the short link must always resolve quickly and predictably. That’s why this tool keeps the creation flow minimal—paste a URL, optionally set an expiry, and generate. You don’t need an account, and there’s no extra friction that slows you down. Later, features like custom slugs and branded domains can be layered on top without changing the fundamentals.",
        "Click counting is built into the redirect step. Every time a visitor opens the short URL, the tool increments a click counter in the database before redirecting. This gives you a simple performance signal for campaigns, QR codes, flyers, or social posts. If you share the same short link in multiple places, you can still track aggregate demand; in later phases you can expand to per-channel tracking using UTM parameters.",
        "Expiry is optional but very practical. Time-limited links are useful for limited offers, event check-ins, temporary documents, or any situation where you want links to stop working automatically. When you set an expiry date/time, the redirect route checks the stored expiry before forwarding the visitor. If the link is expired, it returns an appropriate response (HTTP 410) instead of sending users to an outdated page.",
        "From an SEO perspective, the best practice is to keep tool pages focused: one primary keyword-focused H1, a short intro, the tool UI, and then a clear explanation with FAQs. This structure helps users understand the tool quickly while giving search engines enough context to index the page properly. It also enables internal linking—each tool page points to other useful tools so authority flows across the site.",
        "If you plan to monetize later, URL shortening has several natural upgrade paths: custom slugs, branded short domains, bulk creation, link management dashboards, and team workspaces. Those are intentionally excluded from this MVP to keep the product fast and to maximize indexing and traffic in the first 1–3 months. Once traffic is stable, you can add AdSense or premium options like ‘remove ads’ without breaking the user experience.",
      ]}
      faq={[
        {
          q: "Do I need to create an account?",
          a: "No. This MVP is designed to be instant: paste a URL, generate a short link, and share it.",
        },
        {
          q: "Will my short link stop working?",
          a: "By default, links do not expire. If you set an expiry time, the link will stop redirecting after that time.",
        },
        {
          q: "How is click count calculated?",
          a: "Every redirect increments a counter for that slug. You can refresh the click count in the UI after sharing.",
        },
        {
          q: "Can I choose a custom slug?",
          a: "Not yet. Custom slugs and branded domains are planned as a future paid feature.",
        },
        {
          q: "Does this work with UTM links?",
          a: "Yes. Any valid http(s) URL works, including long links with query parameters.",
        },
      ]}
      relatedLinks={[
        { href: "/qr-code-generator", label: "QR Code Generator" },
        { href: "/password-generator", label: "Password Generator" },
        { href: "/", label: "Homepage" },
      ]}
    >
      <UrlShortenerTool />
    </ToolPageShell>
  );
}
