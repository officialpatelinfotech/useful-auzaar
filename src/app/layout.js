import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getSiteUrl } from "@/lib/siteUrl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "UsefulAuzaar – Fast. Free. Useful.",
    template: "%s | UsefulAuzaar",
  },
  description:
    "UsefulAuzaar is a collection of fast, free, useful online tools like a URL shortener, QR code generator, and password generator.",
};

function SiteHeader() {
  return (
    <header className="border-b border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          UsefulAuzaar
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/url-shortener" className="hover:underline">
            URL Shortener
          </Link>
          <Link href="/qr-code-generator" className="hover:underline">
            QR Codes
          </Link>
          <Link href="/password-generator" className="hover:underline">
            Passwords
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 text-sm text-zinc-600 dark:text-zinc-400">
        <p className="text-zinc-900 dark:text-zinc-100">Fast. Free. Useful.</p>
        <p className="mt-2">
          Built for speed and simplicity. No ads (for now).
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-dvh bg-background text-foreground">
          <SiteHeader />
          <div className="mx-auto w-full max-w-5xl px-6 py-10">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
