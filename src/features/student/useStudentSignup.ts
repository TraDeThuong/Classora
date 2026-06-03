import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signUpStudent } from "../../services/apiAuth";

export function useStudentSignup() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: signup, isPending } = useMutation({
    mutationFn: signUpStudent,
    onSuccess: async (data) => {
      if (!data.session) {
        toast.success("Account created. Please confirm your email, then log in.");
        navigate("/student/login");
        return;
      }

      queryClient.removeQueries({ queryKey: ["teacher"] });
      queryClient.setQueryData(["student"], data.student);
      toast.success("Student account created");
      navigate("/student/dashboard", { replace: true });
    },
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message);
    },
  });

  return { isPending, signup };
}
