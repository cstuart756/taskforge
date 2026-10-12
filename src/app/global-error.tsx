"use client";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <p className="text-6xl font-bold text-red-200 mb-4">500</p>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Application error
            </h1>
            <p className="text-gray-600 mb-8">
              A critical error occurred. Please reload the page.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-400 mb-6 font-mono">
                Reference: {error.digest}
              </p>
            )}
            <button
              type="button"
              onClick={reset}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
            >
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}