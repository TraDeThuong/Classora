import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createAssignment } from "../../services/apiAssignments";

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createAssignment,

    onSuccess: () => {
        toast.success ("New Assignment successfully created")
        queryClient.invalidateQueries({
            queryKey: ["assignment"],
        });
    },

    onError: (err) => {
      console.error(err);
      toast.error (err.message)
    },
  });

  return { mutate, isPending };
}