import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { signInWithGoogleForStudentSignup } from "../../services/apiAuth";

export function useStudentGoogleLogin() {
  const { mutate: googleLogin, isPending } = useMutation({
    mutationFn: signInWithGoogleForStudentSignup,
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message);
    },
  });

  return { googleLogin, isPending };
}
