import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions for using UsefulAuzaar and its tools (URL shortener, QR code generator, password generator).",
};

export default function TermsPage() {
  return (
    <main className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Terms &amp; Conditions</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <p className="max-w-3xl text-base leading-7 text-zinc-700 dark:text-zinc-300">
          By accessing or using UsefulAuzaar, you agree to these Terms &amp;
          Conditions. If you do not agree, do not use the website.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Use of the service</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <ul className="list-disc space-y-2 pl-5">
            <li>You may use the tools for lawful purposes only.</li>
            <li>
              You must not use the service to distribute malware, phishing links,
              spam, or content that infringes on others’ rights.
            </li>
            <li>
              We may limit, suspend, or block access to protect the service and
              users.
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Tool-specific notes</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            <span className="font-medium">URL Shortener:</span> short links may
            stop working if the destination is removed, the link expires, or we
            detect abuse.
          </p>
          <p>
            <span className="font-medium">QR Codes:</span> generated QR codes
            reflect the content you provide. Verify QR code content before
            sharing.
          </p>
          <p>
            <span className="font-medium">Password Generator:</span> passwords
            are generated client-side for convenience. You are responsible for
            using appropriate security practices.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Disclaimer</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            The service is provided on an “as is” and “as available” basis.
            We do not guarantee uninterrupted availability, accuracy, or fitness
            for a particular purpose.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Limitation of liability</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            To the maximum extent permitted by law, UsefulAuzaar will not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, or any loss of data or profits, arising from your
            use of the service.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Changes</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            We may update these Terms from time to time. Continued use of the
            service after changes means you accept the updated Terms.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">Contact</h2>
        <div className="space-y-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          <p>
            Questions about these Terms? Contact: <span className="font-medium">[add-your-email]</span>
          </p>
          <p>
            Related: <Link className="hover:underline" href="/privacy">Privacy Policy</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
