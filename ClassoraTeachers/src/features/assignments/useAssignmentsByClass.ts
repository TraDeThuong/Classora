import { useQuery } from "@tanstack/react-query";
import { getAssignmentsByClassId } from "../../services/apiAssignments";

export function useAssignmentsByClass(classId: number) {
  const {isLoading,data: assignments = [],error, } = useQuery({
    queryKey: ["assignments", classId],
    queryFn: () => getAssignmentsByClassId(classId),
    enabled: !!classId,
  });

  return {
    isLoading,
    assignments,
    error,
  };
}