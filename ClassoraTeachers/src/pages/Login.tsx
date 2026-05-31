import { Link } from "react-router-dom";
import LoginForm from "../features/authentication/LoginForm";
import { useLoginWithGoogle } from "../features/authentication/useLoginWithGoogle";

export default function Login() {

  const { googleLogin, isPending } = useLoginWithGoogle();

  return (
    <div className=" flex min-h-screen items-center justify-center bg-gradient-brand-300 px-4 py-10 flex-col ">
      <div className = "flex mb-30 flex-col">
        <img src = "public/logo.png" alt = "Logo" className = "h-30 w-30 rounded-full mb-5"/>
        <h1 className = "text-brand-400 font-bold"> CLASSORA </h1>
      </div>
      <div
        className="  w-2xl rounded-3xl border border-white/20 bg-white/10 p-6  shadow-xl backdrop-blur-xl sm:p-8 ">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-50">
            Welcome Back
          </h1>

          <p className="mt-2 text-white/60">
            Sign in to continue to Classora
          </p>
        </div>

        <LoginForm/>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-sm text-white/50">or</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => googleLogin()}
          className=" flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 font-semibold text-brand-300 transition-all duration-300 hover:bg-white/90 active:scale-95 " >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-white/60">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className=" font-semibold text-brand-200 transition hover:text-brand-100" >
            Sign up
          </Link>
        </p>

        {/* <div className="mt-3 text-center">
          <Link
            to="/forgot-password" className=" text-sm text-white/60 transition hover:text-white" >
            Forgot password?
          </Link>
        </div> */}
      </div>
    </div>
  );
}