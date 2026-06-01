import { useQuery } from "@tanstack/react-query";
import { getAssignmentDetail } from "../../services/apiAssignments";

export function useAssignmentDetail(assignmentId: number) {
  const { data: assignment, isLoading } = useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignmentDetail(assignmentId),
    enabled: !!assignmentId,
  });

  return { assignment, isLoading };
}