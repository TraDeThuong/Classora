import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCurrentTeacher, login, logout } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,

    onSuccess: async () => {
        const teacher = await getCurrentTeacher();

        if (!teacher) {
          await logout();
          queryClient.clear();
          toast.error("This account is not registered as a teacher");
          navigate("/teacher/login", { replace: true });
          return;
        }

        queryClient.removeQueries({ queryKey: ["student"] });
        queryClient.setQueryData(["teacher"], teacher);
        navigate("/teacher/dashboard", { replace: true });
    },

    onError: (error) => {
        console.error(error.message);
        toast.error ("Provided email or password are incorrect")
    },
  });

  return { loginUser, isPending };
}
