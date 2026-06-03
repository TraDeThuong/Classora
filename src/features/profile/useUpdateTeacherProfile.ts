import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateCurrentTeacherProfile } from "../../services/apiAuth";
import type { UpdateTeacherProfileData } from "../../services/apiAuth";

export default function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: (data: UpdateTeacherProfileData) =>
      updateCurrentTeacherProfile(data),

    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["teacher"],
      });
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updateProfile, isUpdating };
}