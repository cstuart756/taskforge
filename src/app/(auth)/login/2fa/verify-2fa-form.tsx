"use client";

import { useActionState } from "react";
import Link from "next/link";
import { verify2FA, type Verify2FAResult } from "@/lib/two-factor-login-actions";

type Props = {
  pendingToken: string;
};

const initialState: Verify2FAResult | undefined = undefined;

export default function Verify2FAForm({ pendingToken }: Props) {
  const [state, formAction, isPending] = useActionState(
    verify2FA,
    initialState
  );

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Two-factor authentication
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Enter the 6-digit code from your authenticator app, or use one of your
        backup codes.
      </p>

      {state?.success === false && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="pendingToken" value={pendingToken} />

        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Authentication code
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="text"
            autoComplete="one-time-code"
            autoFocus
            required
            maxLength={16}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-lg tracking-widest text-center"
            placeholder="000000"
          />
          <p className="mt-2 text-xs text-gray-500">
            Accepts a 6-digit code (e.g. <span className="font-mono">123456</span>)
            or an 8-character backup code (e.g.{" "}
            <span className="font-mono">ABCD-EFGH</span>).
          </p>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Verifying..." : "Verify and sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Lost your device or codes?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Start over
        </Link>
      </p>
    </div>
  );
}