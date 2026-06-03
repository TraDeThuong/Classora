import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { gradeResult } from "../../services/apiResults";

export function useGradeResult(assignmentId: number) {
  const queryClient = useQueryClient();

  const { mutate: grade, isPending: isGrading } = useMutation({
    mutationFn: gradeResult,
    onSuccess: () => {
      toast.success("Result graded successfully");
      queryClient.invalidateQueries({
        queryKey: ["assignment-results", assignmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { grade, isGrading };
}
