import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {signInWithGoogleForSignup } from "../services/apiAuth";
import { useGoogleLogin } from "../features/authentication/useGoogleLogin";
import { useSignUp } from "../features/authentication/useSignup";
import { MiniSpinner } from "../components/MiniSpinner";


interface SignUpFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "Teacher" | "Student";
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "Teacher",
    },
  });

  const { signup, isPending: isSigningUp } = useSignUp();
  const { googleLogin, isPending: isGoogleLoading } = useGoogleLogin();

  const onSubmit = (data: SignUpFormData) => {
    signup({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-brand-300 px-4 py-10">
      <div className="w-full max-w-2xl rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-brand-50">
            CREATE ACCOUNT
          </h1>

          <p className="mt-2 text-white/60">Join Classora today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Your full name"
              {...register("fullName", {
                required: "Full name is required",
              })}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-brand-200"
            />

            {errors.fullName && (
              <p className="mt-1 text-sm text-red-300">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Email
            </label>

            <input
              type="email"
              placeholder="example@gmail.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-brand-200"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-300">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white  placeholder:text-white/40  outline-none transition focus:border-brand-200" />

            {errors.password && (
              <p className="mt-1 text-sm text-red-300">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Re-enter your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              })}
              className="
                w-full rounded-xl
                border border-white/20
                bg-white/10 px-4 py-3
                text-white
                placeholder:text-white/40
                outline-none transition
                focus:border-brand-200
              "
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-300">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* SAU NAY SE PHAT TRIEN, TICH HOP CA HAI TRANG WEB VAO 1 WEBSITE*}
          {/* <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Role
            </label>

            <select
              {...register("role")}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none transition focus:border-brand-200"
            >
              <option value="Teacher" className="text-black">
                Teacher
              </option>
              <option value="Student" className="text-black">
                Student
              </option>
            </select>
          </div> */}

          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full rounded-xl bg-brand-200 py-3 font-semibold text-white transition-all duration-300 hover:bg-brand-100 active:scale-95 disabled:opacity-60"
          >
            {isSigningUp ? "Creating account..." : "Create Account"}
          </button>

        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-sm text-white/50">or</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <button
          type="button"
          disabled={isGoogleLoading}
          onClick={() => signInWithGoogleForSignup()}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-brand-300 transition-all duration-300 hover:bg-white/90 active:scale-95 disabled:opacity-60"
        >
          {isGoogleLoading && <MiniSpinner color="primary" />}
          <span>{isGoogleLoading ? "Đang xử lý..." : "Continue with Google"}</span>
        </button>

        <p className="mt-6 text-center text-lg text-white/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              font-semibold text-brand-200
              transition hover:text-brand-100
            "
          >
            Log in
          </Link>
        </p>

      </div>
    </div>
  );
}