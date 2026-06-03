import { useQuery } from "@tanstack/react-query";
import { getCurrentStudent } from "../../services/apiAuth";

export function useStudent() {
  const {
    data: student,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["student"],
    queryFn: getCurrentStudent,
  });

  return {
    error,
    isAuthenticated: !!student,
    isLoading,
    student,
  };
}
