import ToolPageShell from "@/components/ToolPageShell";
import PasswordGeneratorTool from "@/components/tools/PasswordGeneratorTool";

export const metadata = {
  title: "Strong Password Generator – Secure Passwords Instantly",
  description:
    "Create secure, strong passwords instantly. Choose length and character sets, then copy with one click.",
  alternates: { canonical: "/strong-password-generator" },
};

export default function StrongPasswordGeneratorPage() {
  return (
    <ToolPageShell
      h1="Strong Password Generator – Secure Passwords Instantly"
      intro="Need a secure password right now? Generate a strong password instantly with the settings you want and copy it in one click."
      explanationTitle="Strong passwords without guesswork"
      explanationParagraphs={[
        "A ‘strong password’ is one that’s hard for attackers to guess and expensive to brute-force. The easiest way to increase strength is to increase length and avoid human patterns. Names, dates, and common substitutions (like ‘P@ssw0rd’) are not strong—attackers try those early.",
        "This generator creates random passwords in your browser. You pick the length and which character sets to include. If you enable more than one set, the output includes at least one character from each set so you don’t accidentally generate a password that’s all lowercase or all numbers.",
        "The copy button is there for speed. Generate, copy, paste, and store it in a password manager. If you’re creating passwords for multiple accounts, generate a unique password per account. Reuse is the real enemy: one leaked password can unlock several services if it’s reused.",
        "If a website has restrictions (for example, it doesn’t allow certain symbols), turn off symbols or regenerate until it matches the allowed policy. Over time, you can add advanced policy presets, but the MVP stays minimal so the tool remains fast and easy to use.",
        "Strong passwords pair well with two-factor authentication. Even if a password is stolen, 2FA can block the login. Consider enabling it for important accounts like email, banking, and admin dashboards.",
        "UsefulAuzaar keeps tools simple and focused. This page is designed to rank for ‘strong password generator’ searches while still being genuinely useful: clear controls, secure randomness, and a clean UI.",
      ]}
      faq={[
        {
          q: "Do I need symbols for a strong password?",
          a: "Not always. Longer passwords are usually stronger. Symbols can help if a site supports them.",
        },
        {
          q: "Can I generate passwords for work teams?",
          a: "For team credentials, use a password manager with sharing. This tool can generate the secret but doesn’t manage access.",
        },
        {
          q: "Does this work offline?",
          a: "Once the page is loaded, generation happens in-browser. Offline support as a PWA is a possible future improvement.",
        },
      ]}
      relatedLinks={[
        { href: "/password-generator", label: "Password Generator" },
        { href: "/url-shortener", label: "URL Shortener" },
        { href: "/qr-code-generator", label: "QR Code Generator" },
      ]}
    >
      <PasswordGeneratorTool />
    </ToolPageShell>
  );
}
