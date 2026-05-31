import { useMutation } from "@tanstack/react-query";
import { signUpTeacher } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useSignUp() {
    const navigate = useNavigate();
    const { mutate: signup, isPending } = useMutation({
        mutationFn: signUpTeacher,
        onSuccess: () => {
            navigate("/dashboard")
            toast.success ("Account created successfully")
        },

        onError: (error) => {
            console.error(error.message);
            toast.error ("Provided email or password are incorrect")
    },
    });

  return { signup, isPending };
}