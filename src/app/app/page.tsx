import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { logoutUser } from "@/lib/auth-actions";

export default async function AppDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to TaskForge
            </h1>
            <p className="text-gray-600">
              You are signed in as{" "}
              <span className="font-medium text-gray-900">
                {session.user.email}
              </span>
            </p>
          </div>

          <form action={logoutUser}>
            <button
              type="submit"
              className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log out
            </button>
          </form>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-gray-600">
            Task management features will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}