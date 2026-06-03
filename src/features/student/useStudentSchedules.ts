import { useQuery } from "@tanstack/react-query";
import { getStudentSchedules } from "../../services/apiStudentPortal";

export function useStudentSchedules() {
  const {
    data: schedules = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["student-schedules"],
    queryFn: getStudentSchedules,
  });

  return { error, isLoading, schedules };
}
