import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin";

interface LoginFormData {
  email: string;
  password: string;
}


export default function LoginForm() {

    const { loginUser, isPending } = useLogin();

    const {register, handleSubmit, formState: { errors }, } = useForm<LoginFormData>();

    function onSubmit(data: LoginFormData) {
        loginUser(data);
    }



  return (
        <form
          onSubmit={handleSubmit (onSubmit)}
          className="space-y-5"
        >

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Email
            </label>

            <input
              type="email"
              placeholder="example@gmail.com"
              {...register("email", {
                required: "Email is required",
              })}
              className=" w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none  transition focus:border-brand-200 " />

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
              })}
              className=" w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 outline-none transition focus:border-brand-200"/>

            {errors.password && (
              <p className="mt-1 text-sm text-red-300">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center rounded-xl bg-brand-200 py-3 font-semibold text-white transition-all duration-300 hover:bg-brand-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>

        </form>
  )
}
