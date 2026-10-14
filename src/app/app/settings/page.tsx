import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import SiteFooter from "@/components/layout/site-footer";
import AccountSettingsClient from "./account-settings-client";

export const metadata = {
  title: "Account settings",
  description: "Manage your TaskForge account",
};

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      createdAt: true,
      emailVerified: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (!user.emailVerified) {
    redirect("/verify-email");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href="/app"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Account settings
        </h1>

        <AccountSettingsClient
          name={user.name ?? ""}
          email={user.email}
          createdAt={user.createdAt.toISOString()}
          emailVerified={user.emailVerified?.toISOString() ?? null}
        />
      </div>

      <SiteFooter />
    </div>
  );
}