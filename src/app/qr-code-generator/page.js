import ToolPageShell from "@/components/ToolPageShell";
import QrCodeTool from "@/components/tools/QrCodeTool";

export const metadata = {
  title: "QR Code Generator – Create QR Codes for URL, Text, WhatsApp",
  description:
    "Generate QR codes for URLs, text, and WhatsApp. Pick colors and download as PNG or SVG.",
  alternates: { canonical: "/qr-code-generator" },
};

export default function QrCodeGeneratorPage() {
  return (
    <ToolPageShell
      h1="QR Code Generator – Create QR Codes for URL, Text, WhatsApp"
      intro="Generate a QR code for a link, plain text, or a WhatsApp chat. Customize colors and download in PNG or SVG format."
      explanationTitle="Why QR codes drive high-intent traffic"
      explanationParagraphs={[
        "QR codes are one of the fastest ways to move someone from the physical world to the digital one. A QR code can sit on a poster, visiting card, menu, product label, or screen—and with a quick scan, the user lands exactly where you want. That makes QR codes great for offline-to-online conversion, time-sensitive promotions, and frictionless sharing.",
        "This QR Code Generator supports three common use cases: URLs (most common), text (for short notes, Wi‑Fi-like instructions, coupons), and WhatsApp (to open a chat instantly). For WhatsApp, the QR encodes a wa.me link built from the phone number and an optional prefilled message, which is perfect for customer support, lead capture, or quick inquiries.",
        "Color customization matters more than it seems. Brand teams often need a QR that matches a design system, and event organizers need QR codes that are visible on different backgrounds. This tool lets you pick a foreground (QR) color and a background color. The generator uses a standard error correction level so the QR remains scannable even if design elements are slightly imperfect.",
        "Download formats are important too. PNG is great for most uses: web pages, documents, and quick sharing. SVG is ideal for printing and design work because it scales cleanly without becoming blurry. That’s why this tool provides both exports. The preview you see is the same data that’s downloaded.",
        "For SEO, QR code generator pages often rank well because the intent is direct and high-volume: users are literally searching to generate a QR code right now. To take advantage of that, the page is structured with a clear H1, a short intro, the generator UI, and an explanation that covers practical questions. Internal links then guide users to adjacent tools—like shortening a URL before creating a QR.",
        "A simple workflow that works well is: create a short URL, then generate a QR code for it. Short links look cleaner when printed next to the QR (as a fallback) and they allow click tracking. If you’re running a campaign, that combination gives you both scan-based traffic and measurable engagement.",
      ]}
      faq={[
        {
          q: "Can I generate a WhatsApp QR code?",
          a: "Yes. Select WhatsApp mode, enter a phone number (with country code), and optionally a message.",
        },
        {
          q: "Which download format should I use?",
          a: "Use PNG for general web use. Use SVG for print or design work where scaling matters.",
        },
        {
          q: "Why does my QR code not scan?",
          a: "Make sure the encoded value is correct and the color contrast is strong (dark QR on light background).",
        },
        {
          q: "Can I create a QR code for a short link?",
          a: "Yes—use the URL Shortener first, then paste the short URL here.",
        },
      ]}
      relatedLinks={[
        { href: "/url-shortener", label: "URL Shortener" },
        { href: "/password-generator", label: "Password Generator" },
        { href: "/", label: "Homepage" },
      ]}
    >
      <QrCodeTool />
    </ToolPageShell>
  );
}
