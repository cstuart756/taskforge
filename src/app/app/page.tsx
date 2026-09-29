import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { logoutUser } from "@/lib/auth-actions";
import { getUserTeams } from "@/lib/team-actions";

function formatRole(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function formatPlan(plan: string): string {
  return plan === "PRO" ? "Pro plan" : "Free plan";
}

function formatMembers(count: number): string {
  return count === 1 ? "1 member" : `${count} members`;
}

export default async function AppDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const teams = await getUserTeams();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to TaskForge
            </h1>
            <p className="text-gray-600">
              Signed in as{" "}
              <span className="font-medium text-gray-900">
                {session.user.email}
              </span>
            </p>
          </div>

          <form action={logoutUser}>
            <button
              type="submit"
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log out
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Your teams
          </h2>
          <Link
            href="/app/teams/new"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Create team
          </Link>
        </div>

        {teams.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              You do not have any teams yet.
            </p>
            <Link
              href="/app/teams/new"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create your first team
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {teams.map((team) => (
              <li
                key={team.id}
                className="bg-white border border-gray-200 rounded-lg p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatRole(team.role)} · {formatPlan(team.plan)} ·{" "}
                    {formatMembers(team.memberCount)}
                  </p>
                </div>
                <Link
                  href={`/app/teams/${team.slug}`}
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Open →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}