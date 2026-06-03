import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createStudentProfileFromGoogle,
  logout,
  STUDENT_TEACHER_ACCOUNT_ERROR,
} from "../../services/apiAuth";

export default function StudentAuthCallback() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    hasRun.current = true;

    async function handleCallback() {
      try {
        const student = await createStudentProfileFromGoogle();
        queryClient.removeQueries({ queryKey: ["teacher"] });
        queryClient.setQueryData(["student"], student);
        navigate("/student/dashboard", { replace: true });
      } catch (error) {
        console.error(error);
        const message =
          error instanceof Error
            ? error.message
            : "Student profile could not be created";

        await logout().catch(() => undefined);
        queryClient.clear();
        toast.error(
          message === STUDENT_TEACHER_ACCOUNT_ERROR
            ? STUDENT_TEACHER_ACCOUNT_ERROR
            : message,
        );
        navigate("/student/login", { replace: true });
      }
    }

    handleCallback();
  }, [navigate, queryClient]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-brand-300 text-white">
      Creating your student account...
    </div>
  );
}
