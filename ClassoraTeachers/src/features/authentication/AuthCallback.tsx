import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createTeacherProfileFromGoogle } from "../../services/apiAuth";


export default function AuthCallback() {
  const navigate = useNavigate();

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;

        hasRun.current = true;

        async function handleCallback() {
            try {
            await createTeacherProfileFromGoogle();
            navigate("/dashboard");
            } catch (error) {
            console.error(error);
            navigate("/signup");
            }
        }

  handleCallback();
}, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-brand-300 text-white">
      Creating your account...
    </div>
  );
}