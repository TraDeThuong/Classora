import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClassStudent } from "../../services/apiClassStudents";
import toast from "react-hot-toast";

export function useDeleteClassStudent(classId: number) {
  const queryClient = useQueryClient();

  const { mutate: removeStudent, isPending: isDeleting } = useMutation({
    mutationFn: deleteClassStudent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-students", classId],
      });

      queryClient.invalidateQueries({
        queryKey: ["students"],
      });

      queryClient.invalidateQueries({
        queryKey: ["students", "search"],
      });
      toast.success ("Student removed to class successfully")
    },
  });

  return { removeStudent, isDeleting };
}