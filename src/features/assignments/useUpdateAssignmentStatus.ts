import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssignmentStatus } from "../../services/apiAssignments";
import toast from "react-hot-toast";


export function useUpdateAssignmentStatus() {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateAssignmentStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });
      toast.success ("Assignment status updated successfully!")
    },
  });

  return { updateStatus, isUpdating };
}