import { notFound } from "next/navigation";
import Link from "next/link";
import { getTaskById } from "@/lib/task-actions";
import TaskStatusButton from "@/components/task/task-status-button";
import DeleteTaskButton from "@/components/task/delete-task-button";
import CommentForm from "@/components/comment/comment-form";
import { getCommentsForTask } from "@/lib/comment-actions";

type PageProps = {
  params: Promise<{ id: string }>;
};

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

function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function timeAgo(date: Date): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return then.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;
  const task = await getTaskById(id);

    if (!task) {
    notFound();
  }

  const comments = await getCommentsForTask(task.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href={`/app/teams/${task.team.slug}`}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to {task.team.name}
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between gap-6 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {task.title}
            </h1>
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
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              Description
            </h2>
            {task.description ? (
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="text-gray-400 italic">No description.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Details</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Due date</dt>
              <dd className="text-gray-900 mt-1">
                {formatDate(task.dueDate)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Assignee</dt>
              <dd className="text-gray-900 mt-1">
                {task.assignee
                  ? (task.assignee.name ?? task.assignee.email)
                  : "Unassigned"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Created by</dt>
              <dd className="text-gray-900 mt-1">
                {task.creator.name ?? task.creator.email}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Created at</dt>
              <dd className="text-gray-900 mt-1">
                {formatDateTime(task.createdAt)}
              </dd>
            </div>
            {task.completedAt && (
              <div>
                <dt className="text-gray-500">Completed at</dt>
                <dd className="text-gray-900 mt-1">
                  {formatDateTime(task.completedAt)}
                </dd>
              </div>
            )}
          </dl>
        </div>

                                <div className="flex items-center gap-3 mb-6">
          <TaskStatusButton taskId={task.id} status={task.status} />
          <Link
            href={`/app/tasks/${task.id}/edit`}
            className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
          >
            Edit
          </Link>
          <DeleteTaskButton taskId={task.id} taskTitle={task.title} />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Comments
            <span className="text-sm font-normal text-gray-500 ml-2">
              {comments.length}{" "}
              {comments.length === 1 ? "comment" : "comments"}
            </span>
          </h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 text-sm mb-4">
              No comments yet. Start the discussion below.
            </p>
          ) : (
            <ul className="space-y-4 mb-6">
              {comments.map((comment) => (
                <li
                  key={comment.id}
                  className="border-l-2 border-gray-200 pl-4"
                >
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.author.name ?? comment.author.email}
                    </span>
                    <span className="text-xs text-gray-500">
                      {timeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.body}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <CommentForm taskId={task.id} />
      </div>
    </div>
  );
}
