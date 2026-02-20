import ToolPageShell from "@/components/ToolPageShell";
import QrCodeTool from "@/components/tools/QrCodeTool";

export const metadata = {
  title: "Generate QR Code Online – Free PNG & SVG Download",
  description:
    "Generate a QR code online for free. Customize colors and download your QR code as PNG or SVG.",
  alternates: { canonical: "/generate-qr-code" },
};

export default function GenerateQrCodePage() {
  return (
    <ToolPageShell
      h1="Generate QR Code Online – Free PNG & SVG Download"
      intro="Generate a QR code online in seconds. Choose URL, text, or WhatsApp, pick colors, and download as PNG or SVG."
      explanationTitle="Generate a QR code that’s clean and scannable"
      explanationParagraphs={[
        "When someone searches ‘generate QR code’, they typically want a result immediately: a scannable code they can place on a page, poster, or product. This generator focuses on that direct intent. You enter the content, preview the QR, and download it in the format you need—without extra steps.",
        "The most common input is a URL. QR codes that point to web pages are great for menus, forms, signup pages, app installs, and event information. Text QR codes are useful for small notes, coupon codes, or short instructions. WhatsApp QR codes help users start a chat instantly, which is ideal for customer support and lead generation.",
        "Color customization is included so your QR can match a brand style, but scan reliability still depends on contrast. The safest setup is a dark QR on a light background. If you experiment with colors, keep the foreground dark enough and the background light enough so phone cameras can separate the modules.",
        "Export formats matter: PNG is pixel-based and widely compatible, so it’s the default for most people. SVG is vector-based, which means it’s perfect for printing and for design tools like Figma or Illustrator because it scales without blurring.",
        "A high-performing QR workflow is to combine this tool with a short link. Short URLs are easier to show as a fallback next to the QR, and they can provide click tracking if the QR is also shared digitally. Use the URL Shortener first, then paste the short link here for a cleaner campaign asset.",
        "As UsefulAuzaar grows, the goal is to keep QR generation fast and reliable while adding only what’s needed. The simplest tools usually win: clear UI, good defaults, and downloads that just work.",
      ]}
      faq={[
        {
          q: "Can I download SVG?",
          a: "Yes. SVG is available for crisp printing and clean scaling.",
        },
        {
          q: "Is there a limit on text length?",
          a: "Very long text can make QR codes dense and harder to scan. URLs and shorter messages scan more reliably.",
        },
        {
          q: "Should I use a short URL?",
          a: "Often yes. A short URL is cleaner to display and can be tracked.",
        },
      ]}
      relatedLinks={[
        { href: "/url-shortener", label: "URL Shortener" },
        { href: "/qr-code-generator", label: "QR Code Generator" },
        { href: "/password-generator", label: "Password Generator" },
      ]}
    >
      <QrCodeTool />
    </ToolPageShell>
  );
}
