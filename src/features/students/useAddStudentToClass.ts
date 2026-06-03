import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStudentToClass } from "../../services/apiClassStudents";
import toast from "react-hot-toast";

export function useAddStudentToClass(classId: number) {
  const queryClient = useQueryClient();

  const { mutate: addStudent, isPending } = useMutation({
    mutationFn: addStudentToClass,

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

      toast.success ("Student added to class successfully")
    },

    onError: (err) => {
      toast.error(err.message);
    },

  });

  return { addStudent, isPending };
}