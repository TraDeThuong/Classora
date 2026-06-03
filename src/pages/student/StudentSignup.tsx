import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { MiniSpinner } from "../../components/MiniSpinner";
import { useStudentGoogleLogin } from "../../features/student/useStudentGoogleLogin";
import { useStudentSignup } from "../../features/student/useStudentSignup";

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
}

export default function StudentSignup() {
  const { googleLogin, isPending: isGoogleLoading } = useStudentGoogleLogin();
  const { signup, isPending } = useStudentSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  function onSubmit(data: SignupFormData) {
    signup(data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-brand-300 px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <img src="/logo.png" alt="Classora" className="mx-auto mb-4 h-24 w-24 rounded-full" />
          <h1 className="text-3xl font-bold text-brand-50">Create Student Account</h1>
          <p className="mt-2 text-white/60">Join classes and submit assignments</p>
        </div>

        <button
          type="button"
          disabled={isGoogleLoading}
          onClick={() => googleLogin()}
          className="mb-5 flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-brand-300 transition hover:bg-white/90 disabled:opacity-60"
        >
          {isGoogleLoading && <MiniSpinner color="primary" />}
          {isGoogleLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">Full name</label>
            <input
              type="text"
              placeholder="Nguyen Van A"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-brand-200"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-300">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Email</label>
            <input
              type="email"
              placeholder="student@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-brand-200"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-brand-200"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-brand-200 py-3 font-semibold text-white transition hover:bg-brand-100 disabled:opacity-60"
          >
            {isPending ? "Creating..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link to="/student/login" className="font-semibold text-brand-100">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
