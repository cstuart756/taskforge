import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAllTasksForUser } from "@/lib/task-actions";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

type StatusFilter = "ALL" | "OPEN" | "IN_PROGRESS" | "DONE";

function parseStatus(value: string | undefined): StatusFilter {
  if (
    value === "OPEN" ||
    value === "IN_PROGRESS" ||
    value === "DONE"
  ) {
    return value;
  }
  return "ALL";
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

function dueDateColour(date: Date | null, status: string): string {
  if (!date || status === "DONE") return "text-gray-500";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  const diffDays = Math.floor(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0) return "text-red-600 font-medium";
  if (diffDays === 0) return "text-amber-600 font-medium";
  if (diffDays <= 2) return "text-amber-600";
  return "text-gray-500";
}

export default async function AllTasksPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { status: statusParam } = await searchParams;
  const statusFilter = parseStatus(statusParam);

  const tasks = await getAllTasksForUser(
    statusFilter === "ALL" ? undefined : statusFilter
  );

  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "OPEN", label: "Open" },
    { key: "IN_PROGRESS", label: "In progress" },
    { key: "DONE", label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href="/app"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All tasks
          </h1>
          <p className="text-gray-600">
            Every task across your teams, sorted by due date.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6 border-b border-gray-200">
          {filterTabs.map((tab) => {
            const isActive = tab.key === statusFilter;
            const href =
              tab.key === "ALL" ? "/app/tasks" : `/app/tasks?status=${tab.key}`;
            return (
              <Link
                key={tab.key}
                href={href}
                className={
                  isActive
                    ? "px-4 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600 -mb-px"
                    : "px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 -mb-px"
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          {tasks.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-2">
                {statusFilter === "ALL"
                  ? "You do not have any tasks yet."
                  : `No ${statusFilter.toLowerCase().replace("_", " ")} tasks.`}
              </p>
              <p className="text-sm text-gray-500">
                Create tasks from within a team.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {tasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/app/tasks/${task.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                        <span>{task.team.name}</span>
                        <span className={dueDateColour(task.dueDate, task.status)}>
                          · {formatDate(task.dueDate)}
                        </span>
                        {task.assignee && (
                          <span>
                            · {task.assignee.name ?? task.assignee.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
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
      </div>
    </div>
  );
}