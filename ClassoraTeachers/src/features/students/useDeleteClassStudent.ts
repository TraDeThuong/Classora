import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClassStudent } from "../../services/apiClassStudents";

export function useDeleteClassStudent(classId: number) {
  const queryClient = useQueryClient();

  const { mutate: removeStudent, isPending: isDeleting } = useMutation({
    mutationFn: deleteClassStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-students", classId],
      });

      queryClient.invalidateQueries({
        queryKey: ["students", "search"],
      });
    },
  });

  return { removeStudent, isDeleting };
}