import type { Metadata } from "next";
import LegalLayout from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TaskForge collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="6 October 2026">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          1. Who we are
        </h2>
        <p>
          TaskForge is a task management application for small teams. In this
          policy, &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; refer to
          TaskForge. &quot;You&quot; refers to any person who uses the service.
        </p>
        <p className="mt-3">
          If you have any questions about this policy, contact us at{" "}
          <a
            href="mailto:cstuart756@gmail.com"
            className="text-blue-600 hover:underline"
          >
            cstuart756@gmail.com
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          2. What personal data we collect
        </h2>
        <p>We collect the following personal data:</p>
        <ul className="list-disc list-inside mt-3 space-y-2">
          <li>
            <strong>Account information:</strong> your name, email address, and
            a securely hashed password.
          </li>
          <li>
            <strong>Content you create:</strong> tasks, comments, teams, and any
            other data you enter into TaskForge.
          </li>
          <li>
            <strong>Technical data:</strong> IP address, browser type, and
            access timestamps, collected automatically for security and
            operational purposes.
          </li>
        </ul>
        <p className="mt-3">
          We do not collect payment card details directly — these are handled
          entirely by Stripe, our payment processor, when billing is enabled.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          3. Why we collect it (lawful basis)
        </h2>
        <p>We process your personal data on these lawful bases under GDPR:</p>
        <ul className="list-disc list-inside mt-3 space-y-2">
          <li>
            <strong>Contract:</strong> to provide the TaskForge service you have
            signed up for.
          </li>
          <li>
            <strong>Legitimate interests:</strong> to secure the service,
            prevent abuse, and improve reliability.
          </li>
          <li>
            <strong>Consent:</strong> where you have explicitly opted in (for
            example, product analytics or marketing emails, if enabled).
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          4. Who we share it with
        </h2>
        <p>
          We share personal data only with the service providers required to
          operate TaskForge:
        </p>
        <ul className="list-disc list-inside mt-3 space-y-2">
          <li>
            <strong>Supabase:</strong> hosts the PostgreSQL database where your
            data is stored (EU region).
          </li>
          <li>
            <strong>Heroku:</strong> hosts the application servers (EU region).
          </li>
          <li>
            <strong>Stripe:</strong> processes payments if you subscribe to a
            paid plan.
          </li>
          <li>
            <strong>Resend:</strong> delivers transactional emails such as
            password resets.
          </li>
        </ul>
        <p className="mt-3">
          We never sell your personal data to third parties.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          5. How long we keep it
        </h2>
        <p>
          We keep your personal data for as long as your account is active. If
          you delete your account, we remove your personal data within 30 days,
          except where we are legally required to keep it (for example, invoice
          records for tax purposes, retained for 6 years).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          6. Your rights
        </h2>
        <p>Under GDPR you have the right to:</p>
        <ul className="list-disc list-inside mt-3 space-y-2">
          <li>Access the personal data we hold about you.</li>
          <li>Correct inaccurate personal data.</li>
          <li>Request deletion of your personal data.</li>
          <li>Restrict or object to certain processing.</li>
          <li>Receive your data in a portable format.</li>
          <li>Withdraw consent at any time.</li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, contact us at{" "}
          <a
            href="mailto:cstuart756@gmail.com"
            className="text-blue-600 hover:underline"
          >
            cstuart756@gmail.com
          </a>
          . You also have the right to lodge a complaint with the UK
          Information Commissioner&apos;s Office (ICO).
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          7. Cookies
        </h2>
        <p>
          TaskForge uses essential cookies only — specifically, a session
          cookie to keep you signed in. We do not use tracking or advertising
          cookies. If we add product analytics in the future, this policy will
          be updated and any non-essential cookies will require your consent.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          8. Security
        </h2>
        <p>
          We protect your data using encryption in transit (HTTPS/TLS 1.3),
          password hashing (bcrypt), and secure session handling. No system is
          completely secure, but we take reasonable measures to protect your
          information.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          9. Changes to this policy
        </h2>
        <p>
          We may update this policy from time to time. If we make material
          changes, we will notify you by email or through the service. The
          &quot;Last updated&quot; date at the top reflects the most recent
          revision.
        </p>
      </section>
    </LegalLayout>
  );
}