import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateClass } from "../../services/apiClasses";

export function useUpdateClass(classId: number) {
  const queryClient = useQueryClient();

  const { mutate: updateClassInfo, isPending: isUpdating } = useMutation({
    mutationFn: updateClass,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class", classId],
      });

      queryClient.invalidateQueries({
        queryKey: ["classes"],
      });

      toast.success("Class updated successfully");
    },

    onError: (err) => {
      toast.error(err.message);
    },
  });

  return { updateClassInfo, isUpdating };
}