import { useMutation } from "@tanstack/react-query";
import { loginWithGoogle } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useLoginWithGoogle() {
  const { mutate: googleLogin, isPending } = useMutation({
    mutationFn: loginWithGoogle,

    onError: (error) => {
        console.error(error.message);
        toast.error ("Provided email or password are incorrect")
    },
  });

  return {
    googleLogin,
    isPending,
  };
}