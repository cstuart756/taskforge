import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">TaskForge</span>
          <nav className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple task management for small teams
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            TaskForge helps small teams create, assign, and track tasks
            without the complexity of enterprise tools.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="bg-white text-gray-900 border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 font-medium"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}