import Link from "next/link";

export default function ToolPageShell({
  h1,
  intro,
  children,
  explanationTitle,
  explanationParagraphs,
  faq,
  relatedLinks,
}) {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {h1}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
          {intro}
        </p>
      </header>

      <section className="rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-black">
        {children}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          {explanationTitle}
        </h2>
        <div className="space-y-4 text-base leading-7 text-zinc-800 dark:text-zinc-200">
          {explanationParagraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
        <div className="space-y-3">
          {faq.map((item) => (
            <details
              key={item.q}
              className="rounded-xl border border-black/[.08] bg-white px-4 py-3 dark:border-white/[.145] dark:bg-black"
            >
              <summary className="cursor-pointer font-medium">{item.q}</summary>
              <div className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Related tools</h2>
        <div className="flex flex-wrap gap-3">
          {relatedLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-black/[.08] px-4 py-2 text-sm hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.06]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
