import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for UsefulAuzaar: what we collect, why we collect it, and how you can contact us.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
          This Privacy Policy explains how UsefulAuzaar (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) handles information when you use our website and tools.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Information we collect</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            <span className="font-medium">Usage data:</span> like approximate
            device/browser details, pages visited, and basic analytics events.
          </p>
          <p>
            <span className="font-medium">Tool inputs:</span> for some tools,
            we may process the data you submit (for example, a URL you want to
            shorten) to provide the requested functionality.
          </p>
          <p>
            <span className="font-medium">Cookies:</span> we may use essential
            cookies for site functionality and optional cookies for analytics.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">How we use information</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>We use information to:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Provide and operate the tools (e.g., URL shortener redirects).</li>
            <li>Improve reliability, performance, and security.</li>
            <li>Prevent abuse (spam, malware links, automated scraping).</li>
            <li>Understand aggregate usage (analytics).</li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">URL shortener notes</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            When you create a short link, we store the destination URL and a
            generated slug so the redirect can work. We also store a click count
            to show basic stats.
          </p>
          <p>
            Do not shorten links to content that is illegal, harmful, or violates
            the rights of others.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Sharing</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            We do not sell your personal information. We may share limited
            information with service providers that help run the site (hosting,
            analytics), strictly for operating the service.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Data retention</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            We keep data only as long as needed to provide the service and comply
            with legal requirements. Short links may be deleted if they expire or
            if we detect abuse.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Your choices</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            You can typically use most tools without creating an account. You can
            also control cookies through your browser settings.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            If you have questions about this policy, contact us at: <span className="font-medium">[add-your-email]</span>
          </p>
          <p>
            Related: <Link className="hover:underline" href="/terms">Terms &amp; Conditions</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
