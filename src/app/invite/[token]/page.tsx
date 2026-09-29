import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { acceptInvitation } from "@/lib/team-actions";

type PageProps = {
  params: Promise<{ token: string }>;
};

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;
  const session = await auth();

  if (!session?.user) {
    const callbackUrl = `/invite/${token}`;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            You are invited
          </h1>
          <p className="text-gray-600 mb-6">
            You need a TaskForge account to accept this invitation. Sign in
            with the email address the invitation was sent to, or create
            an account.
          </p>
          <div className="flex gap-3">
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Sign in
            </Link>
            <Link
              href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 font-medium"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const result = await acceptInvitation(token);

  if (!result.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Could not accept invitation
          </h1>
          <p className="text-gray-600 mb-6">{result.error}</p>
          <Link
            href="/app"
            className="text-blue-600 hover:underline font-medium"
          >
            Go to your dashboard →
          </Link>
        </div>
      </div>
    );
  }

  redirect(`/app/teams/${result.teamSlug}`);
}
