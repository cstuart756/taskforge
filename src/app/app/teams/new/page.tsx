import type { Metadata } from "next";
import Link from "next/link";
import CreateTeamForm from "@/components/team/create-team-form";

export const metadata: Metadata = {
  title: "Create team",
  description: "Create a new team in TaskForge.",
};

export default function NewTeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href="/app"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to dashboard
          </Link>
        </div>

        <CreateTeamForm />
      </div>
    </div>
  );
}