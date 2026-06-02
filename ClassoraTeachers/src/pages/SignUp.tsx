import { Link } from "react-router-dom";
import { useGoogleLogin } from "../features/authentication/useGoogleLogin";
import { MiniSpinner } from "../components/MiniSpinner";

export default function SignUp() {
  const { googleLogin, isPending: isGoogleLoading } = useGoogleLogin();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-brand-300 px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-brand-50">
            CREATE ACCOUNT
          </h1>

          <p className="mt-2 text-white/60">
            Verify your email with Google first
          </p>
        </div>

        <button
          type="button"
          disabled={isGoogleLoading}
          onClick={() => googleLogin()}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-brand-300 transition-all duration-300 hover:bg-white/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGoogleLoading && <MiniSpinner color="primary" />}
          <span>
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </span>
        </button>

        <p className="mt-6 text-center text-lg text-white/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand-200 transition hover:text-brand-100"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}