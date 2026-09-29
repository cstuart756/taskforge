"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  createInvitation,
  type InvitationResult,
} from "@/lib/team-actions";

type Props = {
  teamSlug: string;
};

const initialState: InvitationResult | undefined = undefined;

export default function InviteMemberForm({ teamSlug }: Props) {
  const boundAction = createInvitation.bind(null, teamSlug);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div>
      {state?.success === false && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      {state?.success === true && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          {state.message}
        </div>
      )}

      <form ref={formRef} action={formAction} className="flex gap-3">
        <div className="flex-1">
          <input
            type="email"
            name="email"
            required
            placeholder="teammate@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {state?.success === false && state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Invite"}
        </button>
      </form>
    </div>
  );
}