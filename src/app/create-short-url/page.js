import ToolPageShell from "@/components/ToolPageShell";
import UrlShortenerTool from "@/components/tools/UrlShortenerTool";

export const metadata = {
  title: "Create a Short URL – Free Short Link Generator",
  description:
    "Create a short URL for free. Generate a short link instantly, get redirects, and track click counts.",
  alternates: { canonical: "/create-short-url" },
};

export default function CreateShortUrlPage() {
  return (
    <ToolPageShell
      h1="Create a Short URL – Free Short Link Generator"
      intro="Create a short URL you can share anywhere. This generator makes a short link instantly and tracks clicks for you."
      explanationTitle="Create short URLs that people actually click"
      explanationParagraphs={[
        "Short URLs are easier to share and look cleaner in posts, bios, and messages. They’re also easier to print on posters or product packaging. This tool generates a short path that redirects to your destination, so you keep the original link intact while improving usability.",
        "The creation process is intentionally simple. Paste the destination URL, optionally set an expiry time, and generate. The tool stores the mapping between a unique slug and your destination. When someone visits the short URL, the server performs a lookup and redirects quickly.",
        "Click counts are recorded at redirect time. This approach keeps the count accurate for actual visits and avoids guesswork. It’s perfect for quick measurement: you’ll see whether people are engaging with a shared link, and you can compare performance over time.",
        "Expiry support is a small feature that prevents big headaches. If you share a short link for something temporary—like a limited offer, a single event, or a temporary file—you can set a date/time and let the tool handle the rest. Expired links return a clear response instead of sending users to something stale.",
        "A good tool page should answer the natural questions: what does it do, how fast is it, what data is tracked, and how to use it safely. That’s why this page includes an explanation and FAQ alongside the UI. As the site grows, internal links help users find adjacent tools like QR code generation for the same short link.",
        "In the future, you’ll be able to upgrade to custom slugs and branded domains, which help with trust and brand recognition. For now, this generator is built for speed and reliability—create your short URL and share it with confidence.",
      ]}
      faq={[
        {
          q: "What is a short URL?",
          a: "It’s a compact link that redirects to a longer destination URL.",
        },
        {
          q: "Can I set an expiry time?",
          a: "Yes. Expiry is optional—leave it off for links that should keep working.",
        },
        {
          q: "Do short URLs help SEO?",
          a: "They mainly help sharing and tracking. For SEO, focus on clean landing pages and internal links.",
        },
        {
          q: "Can I create a QR code from my short URL?",
          a: "Yes. After generating a short URL, open the QR Code Generator and paste it there.",
        },
      ]}
      relatedLinks={[
        { href: "/qr-code-generator", label: "QR Code Generator" },
        { href: "/url-shortener", label: "URL Shortener" },
        { href: "/password-generator", label: "Password Generator" },
      ]}
    >
      <UrlShortenerTool />
    </ToolPageShell>
  );
}
