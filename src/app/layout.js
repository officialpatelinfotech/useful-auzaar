import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

function SiteHeader() {
  return (
    <header className="border-b border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Image
            src="/logo.png"
            alt="UsefulAuzaar"
            width={28}
            height={28}
            priority
          />
          <span>UsefulAuzaar</span>
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
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 text-sm text-zinc-600 dark:text-zinc-400">
        <p className="text-zinc-900 dark:text-zinc-100">Fast. Free. Useful.</p>
        <p className="mt-2">
          Built for speed and simplicity. No ads (for now).
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms & Conditions
          </Link>
          <span className="text-zinc-500 dark:text-zinc-500">
            © {year} UsefulAuzaar. All rights reserved.
          </span>
        </div>
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
