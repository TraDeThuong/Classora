import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { createTeacherProfileFromGoogle, getCurrentTeacher } from "../../services/apiAuth";


export default function AuthCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;

        hasRun.current = true;

        async function handleCallback() {
            try {
            await createTeacherProfileFromGoogle();
            const teacher = await getCurrentTeacher();
            queryClient.removeQueries({ queryKey: ["student"] });
            queryClient.setQueryData(["teacher"], teacher);
            navigate("/teacher/dashboard", { replace: true });
            } catch (error) {
            console.error(error);
            navigate("/teacher/signup");
            }
        }

  handleCallback();
}, [navigate, queryClient]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-brand-300 text-white">
      Creating your account...
    </div>
  );
}
