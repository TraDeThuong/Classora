import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  loginStudent,
  STUDENT_TEACHER_ACCOUNT_ERROR,
} from "../../services/apiAuth";

export function useStudentLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: login, isPending } = useMutation({
    mutationFn: loginStudent,
    onSuccess: (student) => {
      queryClient.removeQueries({ queryKey: ["teacher"] });
      queryClient.setQueryData(["student"], student);
      navigate("/student/dashboard", { replace: true });
    },
    onError: (error) => {
      console.error(error.message);
      if (error.message === STUDENT_TEACHER_ACCOUNT_ERROR) {
        queryClient.clear();
        toast.error(STUDENT_TEACHER_ACCOUNT_ERROR);
        return;
      }

      if (error.message === "Invalid login credentials") {
        toast.error(
          "Invalid login credentials. If your teacher only added your email, create a student account first. If you signed up with Google, use Continue with Google.",
        );
        return;
      }

      toast.error(error.message);
    },
  });

  return { isPending, login };
}
