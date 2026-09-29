"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createTask, type TaskActionResult } from "@/lib/task-actions";

type TeamMember = {
  id: string;
  name: string | null;
  email: string;
  role: string;
};

type Props = {
  teamSlug: string;
  members: TeamMember[];
};

const initialState: TaskActionResult | undefined = undefined;

export default function CreateTaskForm({ teamSlug, members }: Props) {
  const boundAction = createTask.bind(null, teamSlug);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState
  );

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Create a new task
      </h2>

      {state?.success === false && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title <span className="text-red-600">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={200}
            autoFocus
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {state?.success === false && state.fieldErrors?.title && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.title[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={2000}
            placeholder="Add any details or context..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
          {state?.success === false && state.fieldErrors?.description && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.description[0]}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {state?.success === false && state.fieldErrors?.dueDate && (
              <p className="mt-1 text-sm text-red-600">
                {state.fieldErrors.dueDate[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              defaultValue="NORMAL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assignee
            </label>
            <select
              id="assigneeId"
              name="assigneeId"
              defaultValue=""
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name ?? m.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating..." : "Create task"}
          </button>
          <Link
            href={`/app/teams/${teamSlug}`}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}