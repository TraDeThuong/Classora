import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateClassStatus } from "../../services/apiClasses";

export function useUpdateClassStatus(classId: number) {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: updateClassStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class", classId],
      });

      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });

      toast.success("Class status updated successfully");
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updateStatus, isUpdatingStatus };
}