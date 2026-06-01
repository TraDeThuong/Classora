import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSchedule as deleteScheduleApi } from "../../services/apiCalendars";
import toast from "react-hot-toast";

export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  const { mutate: deleteSchedule, isPending: isDeleting } = useMutation({
    mutationFn: deleteScheduleApi,

    onSuccess: () => {
        toast.success("Schedule deleted successfully");
        queryClient.invalidateQueries({
        queryKey: ["schedules"],
      });
    },

    onError: (err) => {
        toast.error(err.message);
        },
  });

  return {
    deleteSchedule,
    isDeleting,
  };
}