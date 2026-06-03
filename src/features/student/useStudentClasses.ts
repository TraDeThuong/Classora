import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getStudentClasses,
  joinClassByCode,
} from "../../services/apiStudentPortal";

export function useStudentClasses() {
  const {
    data: classes = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["student-classes"],
    queryFn: getStudentClasses,
  });

  return { classes, error, isLoading };
}

export function useJoinClass() {
  const queryClient = useQueryClient();

  const { mutate: joinClass, isPending } = useMutation({
    mutationFn: joinClassByCode,
    onSuccess: () => {
      toast.success("Class joined successfully");
      queryClient.invalidateQueries({ queryKey: ["student-classes"] });
      queryClient.invalidateQueries({ queryKey: ["student-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["student-schedules"] });
    },
    onError: (error) => {
      console.error(error.message);
      toast.error(error.message);
    },
  });

  return { isPending, joinClass };
}
