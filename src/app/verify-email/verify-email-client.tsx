"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth-actions";

type Props = {
  email: string;
};

export default function VerifyEmailClient({ email }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function handleResend() {
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
      });

      let message = "Something went wrong. Please try again.";
      if (!res.ok) {
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
          if (data?.retryAfter) {
            const mins = Math.ceil(data.retryAfter / 60);
            message += ` Try again in about ${mins} minute${mins === 1 ? "" : "s"}.`;
          }
        } catch {
          // fall through with the default message
        }
        setError(message);
        setStatus("idle");
        return;
      }

      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  function handleRefresh() {
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify your email
        </h1>
        <p className="text-gray-600 mb-6">
          We&apos;ve sent a verification link to:
        </p>
        <p className="font-mono text-sm bg-gray-50 border border-gray-200 rounded px-3 py-2 mb-6 break-all">
          {email}
        </p>

        <p className="text-gray-600 mb-6">
          Click the link in that email to activate your account. It expires in
          24 hours.
        </p>

        {status === "sent" && (
          <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
            A new verification email has been sent.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            I&apos;ve verified — continue
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={status === "sending"}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 font-medium disabled:opacity-50"
          >
            {status === "sending"
              ? "Sending..."
              : status === "sent"
                ? "Send another email"
                : "Resend verification email"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Wrong email address?{" "}
          <form action={logoutUser} className="inline">
            <button
              type="submit"
              className="text-blue-600 hover:underline"
            >
              Sign out
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Did the email not arrive? Check your spam folder.
        </p>
      </div>
    </div>
  );
}