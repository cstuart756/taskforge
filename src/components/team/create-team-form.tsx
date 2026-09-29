"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createTeam, type TeamActionResult } from "@/lib/team-actions";

const initialState: TeamActionResult | undefined = undefined;

export default function CreateTeamForm() {
  const [state, formAction, isPending] = useActionState(
    createTeam,
    initialState
  );

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Create a new team
      </h2>

      {state?.success === false && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Team name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={60}
            autoFocus
            placeholder="e.g. Marketing Team"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            2 to 60 characters. You can change this later.
          </p>
          {state?.success === false && state.fieldErrors?.name && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.name[0]}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Creating..." : "Create team"}
          </button>
          <Link
            href="/app"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}