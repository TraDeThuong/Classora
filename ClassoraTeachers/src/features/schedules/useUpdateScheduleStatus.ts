import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScheduleStatus } from "../../services/apiCalendars";

export function useUpdateScheduleStatus() {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateScheduleStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["schedules"],
      });
    },
  });

  return { updateStatus, isUpdating };
}