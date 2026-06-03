import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScheduleStatus } from "../../services/apiCalendars";
import toast from "react-hot-toast";

export function useUpdateScheduleStatus() {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateScheduleStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["schedules"],
      });
      toast.success ("Schedule status updated successfully!")
    },
  });

  return { updateStatus, isUpdating };
}