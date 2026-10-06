import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <p className="text-6xl font-bold text-gray-300 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
          >
            Go home
          </Link>
          <Link
            href="/app"
            className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 font-medium"
          >
            Open app
          </Link>
        </div>
      </div>
    </div>
  );
}