import ToolPageShell from "@/components/ToolPageShell";
import PasswordGeneratorTool from "@/components/tools/PasswordGeneratorTool";

export const metadata = {
  title: "Password Generator – Create Strong Passwords",
  description:
    "Generate strong passwords with custom length and character options. Copy in one click.",
  alternates: { canonical: "/password-generator" },
};

export default function PasswordGeneratorPage() {
  return (
    <ToolPageShell
      h1="Password Generator – Create Strong Passwords"
      intro="Generate a strong password with the right length and character mix. Choose settings and copy instantly."
      explanationTitle="How to generate a strong password"
      explanationParagraphs={[
        "A strong password is one of the simplest ways to improve your online security. The main goal is to make the password hard to guess and hard to brute-force. That usually means increasing length and using a mix of character types (lowercase, uppercase, numbers, and symbols) instead of relying on common words.",
        "This password generator gives you control without complexity. Pick a length, choose which character sets to include, and generate. The generator uses your browser’s cryptographic randomness (via Web Crypto) rather than predictable math random functions. That makes the output significantly more resistant to guessing.",
        "Length matters more than people think. A longer password can be far stronger than a short one with many symbols. For many everyday accounts, 12–20 characters is a practical baseline. For highly sensitive accounts, go longer. The slider here makes it easy to adjust based on the account and your password manager.",
        "If you enable multiple character sets, the generator ensures at least one character from each selected set, then fills the rest from the combined pool and shuffles the result. This avoids weak patterns like ‘all numbers at the end’ and makes the password more uniform.",
        "The safest way to use strong passwords is with a password manager, so you don’t need to memorize long strings. Generate a password, copy it, paste it into your signup form, and store it. Reusing passwords across sites is risky, so treat each generated password as single-use for one service.",
        "From a product standpoint, this tool is an ‘easy win’ that also brings consistent organic traffic. It pairs well with other tools on UsefulAuzaar, and internal links help users discover adjacent utilities without forcing them to hunt.",
      ]}
      faq={[
        {
          q: "Is this password generator safe?",
          a: "It runs in your browser and uses cryptographic randomness. Nothing is sent to a server.",
        },
        {
          q: "What length should I use?",
          a: "A common baseline is 12–20 characters. Use longer for high-value accounts.",
        },
        {
          q: "Should I include symbols?",
          a: "If the site allows it, symbols can help. Length is still the biggest factor.",
        },
        {
          q: "Do you store generated passwords?",
          a: "No. This tool doesn’t save passwords.",
        },
      ]}
      relatedLinks={[
        { href: "/url-shortener", label: "URL Shortener" },
        { href: "/qr-code-generator", label: "QR Code Generator" },
        { href: "/", label: "Homepage" },
      ]}
    >
      <PasswordGeneratorTool />
    </ToolPageShell>
  );
}
