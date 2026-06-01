import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAssignment as deleteAssignmentApi } from "../../services/apiAssignments";

export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  const { mutate: deleteAssignment, isPending: isDeleting } = useMutation({
    mutationFn: deleteAssignmentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["assignments"],
      });
    },
  });

  return { deleteAssignment, isDeleting };
}