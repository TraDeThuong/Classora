import { useQuery } from "@tanstack/react-query";
import { getTeacherResults } from "../../services/apiResults";

export function useTeacherResults() {
  const {
    data: results = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["teacher-results"],
    queryFn: getTeacherResults,
  });

  return { error, isLoading, results };
}
