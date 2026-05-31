

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClass } from "../../services/apiClasses";
import toast from "react-hot-toast";

export function useCreateClass() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createClass,

    onSuccess: () => {
        toast.success ("New Class successfully created")
        queryClient.invalidateQueries({
            queryKey: ["classes"],
        });
    },

    onError: (err) => {
      console.error(err);
      toast.error (err.message)
    },
  });

  return { mutate, isPending };
}