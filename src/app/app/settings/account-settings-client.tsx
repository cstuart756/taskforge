"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  updateName,
  changePassword,
  type SettingsActionResult,
} from "@/lib/account-actions";

type Props = {
  name: string;
  email: string;
  createdAt: string;
  emailVerified: string | null;
};

const initial: SettingsActionResult | undefined = undefined;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AccountSettingsClient({
  name,
  email,
  createdAt,
  emailVerified,
}: Props) {
  const [nameState, nameAction, namePending] = useActionState(
    updateName,
    initial
  );
  const [passState, passAction, passPending] = useActionState(
    changePassword,
    initial
  );

  return (
    <div className="space-y-6">
      {/* --------------------------------------------------------------- */}
      {/* Security (link to /app/settings/security)                       */}
      {/* --------------------------------------------------------------- */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Security
            </h2>
            <p className="text-sm text-gray-600">
              Manage two-factor authentication and other security settings.
            </p>
          </div>
          <Link
            href="/app/settings/security"
            className="text-sm bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 font-medium whitespace-nowrap"
          >
            Security settings →
          </Link>
        </div>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* Display name                                                    */}
      {/* --------------------------------------------------------------- */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Display name
        </h2>

        <form action={nameAction} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={name}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {nameState?.success === false && nameState.fieldErrors?.name && (
              <p className="mt-1 text-sm text-red-600">
                {nameState.fieldErrors.name[0]}
              </p>
            )}
          </div>

          {nameState?.success === true && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              {nameState.message}
            </div>
          )}

          {nameState?.success === false && !nameState.fieldErrors?.name && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
              {nameState.error}
            </div>
          )}

          <button
            type="submit"
            disabled={namePending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {namePending ? "Saving..." : "Save name"}
          </button>
        </form>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* Email (read-only for now)                                       */}
      {/* --------------------------------------------------------------- */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Email address
        </h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="font-mono text-sm text-gray-900 break-all">
              {email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">Status</p>
            {emailVerified ? (
              <p className="text-sm text-green-700">
                ✓ Verified on {formatDate(emailVerified)}
              </p>
            ) : (
              <p className="text-sm text-yellow-700">Not verified</p>
            )}
          </div>

          <p className="text-xs text-gray-500 pt-2">
            Changing your email address is coming soon.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* Password                                                        */}
      {/* --------------------------------------------------------------- */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Password
        </h2>

        <form action={passAction} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Current password
            </label>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passState?.success === false &&
              passState.fieldErrors?.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passState.fieldErrors.currentPassword[0]}
                </p>
              )}
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passState?.success === false &&
              passState.fieldErrors?.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passState.fieldErrors.newPassword[0]}
                </p>
              )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {passState?.success === false &&
              passState.fieldErrors?.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passState.fieldErrors.confirmPassword[0]}
                </p>
              )}
          </div>

          {passState?.success === true && (
            <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              {passState.message}
            </div>
          )}

          {passState?.success === false &&
            !passState.fieldErrors?.currentPassword &&
            !passState.fieldErrors?.newPassword &&
            !passState.fieldErrors?.confirmPassword && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
                {passState.error}
              </div>
            )}

          <button
            type="submit"
            disabled={passPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {passPending ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>

      {/* --------------------------------------------------------------- */}
      {/* Account info                                                    */}
      {/* --------------------------------------------------------------- */}
      <section className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account</h2>
        <p className="text-sm text-gray-600">
          Member since {formatDate(createdAt)}
        </p>
      </section>
    </div>
  );
}