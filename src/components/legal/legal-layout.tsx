import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  lastUpdated: string;
  children: ReactNode;
};

export default function LegalLayout({ title, lastUpdated, children }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to TaskForge
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated: {lastUpdated}
          </p>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            {children}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <Link href="/privacy" className="hover:text-gray-900 mx-3">
            Privacy Policy
          </Link>
          ·
          <Link href="/terms" className="hover:text-gray-900 mx-3">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}