import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAssignment } from "../../services/apiAssignments";
import toast from "react-hot-toast";

export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  const { mutate: editAssignment, isPending: isEditing } = useMutation({
    mutationFn: ({ id, newData }: { id: number; newData: any }) =>
      updateAssignment(id, newData),

    onSuccess: () => {
      toast.success("Assignment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },

    onError: (err) => toast.error(err.message),
  });

  return { editAssignment, isEditing };
}