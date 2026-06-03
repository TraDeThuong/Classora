import { useQuery } from "@tanstack/react-query";
import { getAssignmentResults } from "../../services/apiResults";

export function useAssignmentResults(assignmentId: number) {
  const {
    data: results = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["assignment-results", assignmentId],
    queryFn: () => getAssignmentResults(assignmentId),
    enabled: !!assignmentId,
  });

  return { error, isLoading, results };
}
