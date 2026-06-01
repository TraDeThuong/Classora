import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSchedule } from "../../services/apiCalendars";
import toast from "react-hot-toast";

export function useCreateSchedule() {
  const queryClient = useQueryClient();

  const { mutate: createScheduleMutate, isPending: isCreating } = useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
        toast.success ("New Schedual successfully created")
        queryClient.invalidateQueries({
            queryKey: ["schedules"],
            });
        },
    onError: (err) => {
        console.error(err);
        toast.error (err.message)
        },
  });

  return { createScheduleMutate, isCreating };
}