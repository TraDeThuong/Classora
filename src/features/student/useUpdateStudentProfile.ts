import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateStudentProfile } from "../../services/apiStudentPortal";

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: updateStudentProfile,

    onSuccess: () => {
      toast.success("Profile updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["student"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return { updateProfile, isUpdating };
}