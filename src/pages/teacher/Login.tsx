import { Link } from "react-router-dom";
import LoginForm from "../../features/authentication/LoginForm";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-brand-300 px-4 py-10">
      <div className="mb-30 flex flex-col items-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="mb-5 h-30 w-30 rounded-full"
        />

        <h1 className="font-bold text-brand-400">CLASSORA</h1>
      </div>

      <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-50">
            Welcome Back
          </h1>

          <p className="mt-2 text-white/60">
            Sign in with the email and password you created
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{" "}
          <Link
            to="/teacher/signup"
            className="font-semibold text-brand-200 transition hover:text-brand-100"
          >
            Sign up
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-white/60">
          Are you a student?{" "}
          <Link
            to="/student/login"
            className="font-semibold text-brand-200 transition hover:text-brand-100"
          >
            Go to student portal
          </Link>
        </p>
      </div>
    </div>
  );
}
