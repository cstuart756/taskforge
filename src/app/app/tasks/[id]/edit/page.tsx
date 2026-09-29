import { notFound } from "next/navigation";
import Link from "next/link";
import { getTaskById } from "@/lib/task-actions";
import { getTeamBySlug } from "@/lib/team-actions";
import EditTaskForm from "@/components/task/edit-task-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

function toDateInputValue(date: Date | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function EditTaskPage({ params }: PageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  const team = await getTeamBySlug(task.team.slug);

  if (!team) {
    notFound();
  }

  const members = team.members.map((m) => ({
    id: m.user.id,
    name: m.user.name,
    email: m.user.email,
    role: m.role,
  }));

  const currentTask = {
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: toDateInputValue(task.dueDate),
    priority: task.priority,
    assigneeId: task.assignee?.id ?? null,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href={`/app/tasks/${task.id}`}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to task
          </Link>
        </div>

        <EditTaskForm task={currentTask} members={members} />
      </div>
    </div>
  );
}
