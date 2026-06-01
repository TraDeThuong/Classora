import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStudentToClass } from "../../services/apiClassStudents";


export function useAddStudentToClass(classId: number) {
  const queryClient = useQueryClient();

  const { mutate: addStudent, isPending } = useMutation({
    mutationFn: addStudentToClass,

    onSuccess: () => {
    queryClient.invalidateQueries({
        queryKey: ["class-students", classId],
    });

    queryClient.invalidateQueries({
        queryKey: ["students", "search"],
    });
    },
  });

  return { addStudent, isPending };
}