import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import SiteFooter from "@/components/layout/site-footer";
import SecuritySettingsClient from "./security-settings-client";

export const metadata = {
  title: "Security settings",
  description: "Manage your TaskForge account security",
};

export default async function SecuritySettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      emailVerified: true,
      twoFactorEnabled: true,
      twoFactorEnabledAt: true,
      twoFactorBackupCodes: true,
    },
  });

  if (!user) redirect("/login");
  if (!user.emailVerified) redirect("/verify-email");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <Link
            href="/app/settings"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to settings
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Security settings
        </h1>

        <SecuritySettingsClient
          enabled={user.twoFactorEnabled}
          enabledAt={user.twoFactorEnabledAt?.toISOString() ?? null}
          backupCodeCount={user.twoFactorBackupCodes.length}
        />
      </div>

      <SiteFooter />
    </div>
  );
}