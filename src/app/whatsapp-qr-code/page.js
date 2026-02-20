import ToolPageShell from "@/components/ToolPageShell";
import QrCodeTool from "@/components/tools/QrCodeTool";

export const metadata = {
  title: "WhatsApp QR Code Generator – Start Chats Instantly",
  description:
    "Create a WhatsApp QR code for a phone number with an optional prefilled message. Download as PNG or SVG.",
  alternates: { canonical: "/whatsapp-qr-code" },
};

export default function WhatsAppQrCodePage() {
  return (
    <ToolPageShell
      h1="WhatsApp QR Code Generator – Start Chats Instantly"
      intro="Create a WhatsApp QR code that opens a chat with one scan. Add a phone number, optionally prefill a message, and download as PNG or SVG."
      explanationTitle="WhatsApp QR codes for support and leads"
      explanationParagraphs={[
        "A WhatsApp QR code is a simple growth and support tool: it removes friction between ‘I have a question’ and ‘I’m chatting with you’. Instead of asking users to save a number or type a message, a single scan can open WhatsApp directly. That’s useful for storefronts, clinics, events, delivery services, and any business that relies on fast responses.",
        "This generator builds a standard wa.me link from the phone number and an optional prefilled message. When scanned, the QR opens the WhatsApp chat screen and can populate the message text so the user can send it immediately. Prefilled messages are great for context, like ‘I want to book an appointment’ or ‘I’m interested in pricing’.",
        "For best results, use a phone number with country code and avoid punctuation. Keep the QR colors high-contrast so scanning works on a wide range of cameras and lighting conditions. A dark foreground on a light background is the safest combination.",
        "Download PNG when you need quick compatibility for websites and documents. Download SVG when you’re printing banners, flyers, or packaging and want the QR to stay crisp at any size. In both cases, test the final asset by scanning with a couple of phones before you publish or print at scale.",
        "If you’re running campaigns, it can be helpful to combine a QR code with a short link as a backup. People who can’t scan can still type the short link. For web campaigns, short links also give you click counting and easy sharing.",
        "The goal of UsefulAuzaar is to stay simple and fast. This WhatsApp QR generator keeps the core experience minimal so you can create a working QR code in under a minute.",
      ]}
      faq={[
        {
          q: "Does the user need WhatsApp installed?",
          a: "Usually yes. On desktop, the link may open WhatsApp Web depending on the device and browser.",
        },
        {
          q: "Can I add a prefilled message?",
          a: "Yes. The message is encoded into the wa.me link so it appears when the chat opens.",
        },
        {
          q: "Is my phone number stored?",
          a: "No. QR generation is done in your browser and nothing is saved by this tool.",
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
