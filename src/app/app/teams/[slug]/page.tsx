import { notFound } from "next/navigation";
import Link from "next/link";
import { getTeamBySlug } from "@/lib/team-actions";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatRole(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function formatPlan(plan: string): string {
  return plan === "PRO" ? "Pro" : "Free";
}

export default async function TeamPage({ params }: PageProps) {
  const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href="/app"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {team.name}
            </h1>
            <p className="text-sm text-gray-600">
              {team.members.length}{" "}
              {team.members.length === 1 ? "member" : "members"}
              {" · "}
              {formatPlan(team.plan)} plan
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Members
          </h2>
          <ul className="divide-y divide-gray-100">
            {team.members.map((member) => (
              <li
                key={member.id}
                className="py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {member.user.name ?? member.user.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {member.user.email}
                  </p>
                </div>
                <span className="text-sm text-gray-600">
                  {formatRole(member.role)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
            <span className="text-xs text-gray-400 uppercase tracking-wide">
              Coming next
            </span>
          </div>
          <p className="text-gray-600">
            Task management will appear here in the next step.
          </p>
        </div>
      </div>
    </div>
  );
}
