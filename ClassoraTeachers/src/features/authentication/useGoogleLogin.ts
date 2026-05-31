import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useGoogleLogin() {
  const { mutate: googleLogin, isPending } = useMutation({
    mutationFn: signInWithGoogle,

    onError: (error) => {
        console.error(error.message);
        toast.error ("Provided email or password are incorrect")
    },
  });

  return { googleLogin, isPending };
}