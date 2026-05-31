import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()

  const { mutate: loginUser, isPending } = useMutation({
    mutationFn: login,

    onSuccess: (user) => {
        queryClient.setQueryData(["user"], user);
        navigate("/dashboard");
    },

    onError: (error) => {
        console.error(error.message);
        toast.error ("Provided email or password are incorrect")
    },
  });

  return { loginUser, isPending };
}