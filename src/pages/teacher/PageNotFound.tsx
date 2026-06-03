import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-brand-200 px-6">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/10 p-10 text-center shadow-2xl backdrop-blur-xl">
        <p className="text-lg font-semibold text-brand-300">404</p>

        <h1 className="mt-3 text-5xl font-bold text-white">
          Page Not Found
        </h1>

        <p className="mt-4 text-xl leading-8 text-white/60">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex rounded-2xl bg-brand-200 px-6 py-3 text-lg font-semibold text-white transition-all hover:-translate-y-1 hover:bg-brand-300 hover:shadow-xl"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}