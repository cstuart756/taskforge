"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser, type AuthActionResult } from "@/lib/auth-actions";

type Props = {
  callbackUrl?: string;
};

const initialState: AuthActionResult | undefined = undefined;

export default function LoginForm({ callbackUrl }: Props) {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Welcome back
      </h2>

      {state?.success === false && (
        <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {callbackUrl && (
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {state?.success === false && state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.email[0]}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {state?.success === false && state.fieldErrors?.password && (
            <p className="mt-1 text-sm text-red-600">
              {state.fieldErrors.password[0]}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}