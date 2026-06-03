import type { FallbackProps } from "react-error-boundary";
import Button from "./Button";

export default function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error";

  console.error("Error Boundary triggered:", error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-6">
      <div className="w-full max-w-lg rounded-3xl border border-red-100 bg-white p-10 text-center shadow-2xl">
        <div className="mb-6 text-7xl">⚠️</div>

        <h1 className="mb-3 text-4xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mb-6 text-gray-500">
          An unexpected error occurred while loading this page.
        </p>

        <div className="mb-8 rounded-2xl bg-red-50 p-4 text-left">
          <p className="font-medium text-red-700">Error Details</p>
          <p className="mt-2 break-words text-sm text-red-600">
            {errorMessage}
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <Button size="large" variation="primary" onClick={resetErrorBoundary}>
            Try Again
          </Button>

          <Button
            size="large"
            variation="secondary"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}