import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { completeGoogleSignup } from "../../services/apiAuth";

interface CompleteSignUpForm {
  password: string;
  confirmPassword: string;
}

export default function CompleteSignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CompleteSignUpForm>();

  async function onSubmit(data: CompleteSignUpForm) {
    try {
      await completeGoogleSignup(data.password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-brand-300 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl space-y-5 rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl"
      >
        <h1 className="text-center text-3xl font-bold text-white">
          Create your Classora password
        </h1>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-brand-200"
          />

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
            placeholder="Re-enter password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-brand-200"
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-300">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full rounded-xl bg-brand-200 py-3 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Continue to Dashboard"}
        </button>
      </form>
    </div>
  );
}