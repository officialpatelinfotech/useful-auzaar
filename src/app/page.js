import Link from "next/link";

export default function Home() {
  return (
    <main className="space-y-12">
      <section className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">
          UsefulAuzaar
        </h1>
        <p className="max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
          Fast. Free. Useful. A growing collection of simple online tools built
          for speed, clarity, and SEO-friendly discoverability.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Popular tools</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/url-shortener"
            className="rounded-2xl border border-black/[.08] bg-white p-5 hover:bg-black/[.04] dark:border-white/[.145] dark:bg-black dark:hover:bg-white/[.06]"
          >
            <p className="font-medium">URL Shortener</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Create short links and track clicks.
            </p>
          </Link>
          <Link
            href="/qr-code-generator"
            className="rounded-2xl border border-black/[.08] bg-white p-5 hover:bg-black/[.04] dark:border-white/[.145] dark:bg-black dark:hover:bg-white/[.06]"
          >
            <p className="font-medium">QR Code Generator</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Generate QR codes for links and WhatsApp.
            </p>
          </Link>
          <Link
            href="/password-generator"
            className="rounded-2xl border border-black/[.08] bg-white p-5 hover:bg-black/[.04] dark:border-white/[.145] dark:bg-black dark:hover:bg-white/[.06]"
          >
            <p className="font-medium">Password Generator</p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Create strong passwords in seconds.
            </p>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Recently added</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/url-shortener"
            className="rounded-full border border-black/[.08] px-4 py-2 text-sm hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
          >
            Free URL Shortener
          </Link>
          <Link
            href="/qr-code-generator"
            className="rounded-full border border-black/[.08] px-4 py-2 text-sm hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
          >
            QR Code Generator
          </Link>
          <Link
            href="/password-generator"
            className="rounded-full border border-black/[.08] px-4 py-2 text-sm hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
          >
            Strong Passwords
          </Link>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          About UsefulAuzaar
        </h2>
        <p className="max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
          This homepage is intentionally tool-free. Each tool lives on its own
          page with a clear title, focused explanation, and internal links to
          other tools—so search engines can crawl efficiently and users can find
          exactly what they need.
        </p>
      </section>
    </main>
  );
}

