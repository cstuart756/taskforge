import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTeamBySlug,
  getPendingInvitations,
} from "@/lib/team-actions";
import InviteMemberForm from "@/components/team/invite-member-form";
import InvitationList from "@/components/team/invitation-list";
type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatRole(role: string): string {
  return role.charAt(0) + role.slice(1).toLowerCase();
}

function formatPlan(plan: string): string {
  return plan === "PRO" ? "Pro" : "Free";
}

function formatPriority(priority: string): string {
  switch (priority) {
    case "HIGH":
      return "High";
    case "LOW":
      return "Low";
    default:
      return "Normal";
  }
}

function formatStatus(status: string): string {
  switch (status) {
    case "IN_PROGRESS":
      return "In progress";
    case "DONE":
      return "Done";
    default:
      return "Open";
  }
}

function priorityColour(priority: string): string {
  switch (priority) {
    case "HIGH":
      return "text-red-700 bg-red-50 border-red-200";
    case "LOW":
      return "text-gray-600 bg-gray-50 border-gray-200";
    default:
      return "text-blue-700 bg-blue-50 border-blue-200";
  }
}

function statusColour(status: string): string {
  switch (status) {
    case "DONE":
      return "text-green-700 bg-green-50 border-green-200";
    case "IN_PROGRESS":
      return "text-blue-700 bg-blue-50 border-blue-200";
    default:
      return "text-gray-700 bg-gray-50 border-gray-200";
  }
}

function formatDate(date: Date | null): string {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TeamPage({ params }: PageProps) {
    const { slug } = await params;
  const team = await getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  const invitations = await getPendingInvitations(team.id);

  const openTasks = team.tasks.filter((t) => t.status !== "DONE");
  const doneTasks = team.tasks.filter((t) => t.status === "DONE");

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
          <Link
            href={`/app/teams/${team.slug}/tasks/new`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            + New task
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tasks
            <span className="text-sm font-normal text-gray-500 ml-2">
              {openTasks.length} open · {doneTasks.length} done
            </span>
          </h2>

          {team.tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                This team does not have any tasks yet.
              </p>
              <Link
                href={`/app/teams/${team.slug}/tasks/new`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Create the first task
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {team.tasks.map((task) => (
                <li key={task.id} className="py-3">
                  <Link
                    href={`/app/tasks/${task.id}`}
                    className="flex items-start justify-between hover:bg-gray-50 -mx-3 px-3 py-1 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatDate(task.dueDate)}</span>
                        {task.assignee && (
                          <span>· {task.assignee.name ?? task.assignee.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <span
                        className={`text-xs px-2 py-1 rounded border ${priorityColour(task.priority)}`}
                      >
                        {formatPriority(task.priority)}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded border ${statusColour(task.status)}`}
                      >
                        {formatStatus(task.status)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Invitations
            <span className="text-sm font-normal text-gray-500 ml-2">
              {invitations.length}{" "}
              {invitations.length === 1 ? "pending" : "pending"}
            </span>
          </h2>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">
              Invite someone by entering their email. You will get a link
              to share with them.
            </p>
            <InviteMemberForm teamSlug={team.slug} />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <InvitationList invitations={invitations} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
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
      </div>
    </div>
  );
}