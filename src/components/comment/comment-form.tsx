"use client";

import { useActionState, useEffect, useRef } from "react";
import { addComment, type CommentActionResult } from "@/lib/comment-actions";

type Props = {
  taskId: string;
};

const initialState: CommentActionResult | undefined = undefined;

export default function CommentForm({ taskId }: Props) {
  const boundAction = addComment.bind(null, taskId);
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
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-sm font-medium text-gray-700 mb-4">
        Add a comment
      </h2>

      {state?.success === false && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-3">
        <div>
          <textarea
            name="body"
            rows={3}
            required
            maxLength={2000}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          />
          {state?.success === false && state.fieldErrors?.body && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.body[0]}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>
    </div>
  );
}