import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import supabase from "../../services/supabase";
import { completeGoogleSignup } from "../../services/apiAuth";

interface CompleteSignupFormData {
  password: string;
  confirmPassword: string;
}

export default function CompleteSignup() {
  const navigate = useNavigate();

  const [googleUser, setGoogleUser] = useState<{
    email: string;
    fullName: string;
    avatarUrl?: string;
  } | null>(null);

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<CompleteSignupFormData>();

  useEffect(() => {
    async function loadGoogleUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("Please sign up with Google first");
        navigate("/teacher/signup");
        return;
      }

      setGoogleUser({
        email: user.email || "",
        fullName: user.user_metadata.full_name || user.email || "",
        avatarUrl: user.user_metadata.avatar_url,
      });

      setIsLoadingUser(false);
    }

    loadGoogleUser();
  }, [navigate]);

  async function onSubmit(data: CompleteSignupFormData) {
    try {
      setIsCompleting(true);

      await completeGoogleSignup(data.password);

      toast.success("Account created successfully");
      navigate("/teacher/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Could not complete signup");
    } finally {
      setIsCompleting(false);
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-brand-300 text-white">
        Loading your Google account...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-brand-300 px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="mb-8 text-center">
          {googleUser?.avatarUrl && (
            <img
              src={googleUser.avatarUrl}
              alt={googleUser.fullName}
              className="mx-auto mb-4 h-20 w-20 rounded-full border-4 border-white/30 object-cover"
            />
          )}

          <h1 className="text-3xl font-black text-brand-50">
            Complete Signup
          </h1>

          <p className="mt-2 text-white/60">
            Create a password for your Classora account
          </p>
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-white">
            Full Name
          </label>

          <input
            value={googleUser?.fullName || ""}
            disabled
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white/70 outline-none"
          />
        </div>

        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-white">
            Email
          </label>

          <input
            value={googleUser?.email || ""}
            disabled
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white/70 outline-none"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Password
            </label>

            <input
              type="password"
              placeholder="Create your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-brand-200"
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
              placeholder="Re-enter your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === getValues("password") || "Passwords do not match",
              })}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-brand-200"
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-300">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isCompleting}
            className="w-full rounded-xl bg-brand-200 py-3 font-semibold text-white transition-all duration-300 hover:bg-brand-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCompleting ? "Creating account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
