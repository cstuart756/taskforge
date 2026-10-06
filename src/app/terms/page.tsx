import type { Metadata } from "next";
import LegalLayout from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of TaskForge.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="6 October 2026">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          1. Agreement
        </h2>
        <p>
          By creating a TaskForge account or using the service, you agree to
          these terms. If you do not agree, do not use TaskForge.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          2. Your account
        </h2>
        <p>
          You are responsible for keeping your password confidential and for
          all activity that happens under your account. Notify us immediately
          if you suspect unauthorised access.
        </p>
        <p className="mt-3">
          You must be at least 16 years old to use TaskForge.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          3. Acceptable use
        </h2>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside mt-3 space-y-2">
          <li>Use TaskForge for any unlawful purpose.</li>
          <li>Attempt to access accounts, data, or systems you do not own.</li>
          <li>Upload malicious code or attempt to disrupt the service.</li>
          <li>Reverse-engineer, scrape, or abuse the service.</li>
          <li>Use TaskForge to send spam or unsolicited messages.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          4. Your content
        </h2>
        <p>
          You own the content you create in TaskForge (tasks, comments,
          attachments). You grant us a limited licence to store and display it
          as required to operate the service. We never claim ownership of your
          content.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          5. Subscription and payment
        </h2>
        <p>
          Some features require a paid subscription. Payments are processed
          securely by Stripe. Subscriptions renew automatically unless
          cancelled. You can cancel at any time, and your subscription remains
          active until the end of the current billing period.
        </p>
        <p className="mt-3">
          Prices are shown in pounds sterling and exclude VAT where applicable.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          6. Cancellation and refunds
        </h2>
        <p>
          You may cancel your subscription at any time. Refunds are offered
          within 14 days of initial sign-up, in accordance with UK consumer
          law, provided the service has not been substantially used.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          7. Availability
        </h2>
        <p>
          We aim to keep TaskForge available at all times but do not guarantee
          uninterrupted service. Scheduled maintenance and unforeseen outages
          may cause downtime. We will give reasonable notice of planned
          maintenance.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          8. Termination
        </h2>
        <p>
          We may suspend or terminate your account if you breach these terms.
          You may delete your account at any time. On termination, your data
          will be removed in accordance with our Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          9. Limitation of liability
        </h2>
        <p>
          TaskForge is provided &quot;as is&quot;. To the fullest extent
          permitted by law, we are not liable for indirect, incidental, or
          consequential losses arising from your use of the service. Our total
          liability is limited to the fees you have paid us in the previous 12
          months.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          10. Changes to these terms
        </h2>
        <p>
          We may update these terms from time to time. If we make material
          changes, we will notify you by email or through the service. Continued
          use after changes take effect means you accept the new terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          11. Governing law
        </h2>
        <p>
          These terms are governed by the laws of England and Wales. Any
          disputes will be subject to the exclusive jurisdiction of the courts
          of England and Wales.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          12. Contact
        </h2>
        <p>
          Questions about these terms? Contact us at{" "}
          <a
            href="mailto:cstuart756@gmail.com"
            className="text-blue-600 hover:underline"
          >
            cstuart756@gmail.com
          </a>
          .
        </p>
      </section>
    </LegalLayout>
  );
}