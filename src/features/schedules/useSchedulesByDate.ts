import { useQuery } from "@tanstack/react-query";
import { getSchedulesByDate } from "../../services/apiCalendars";

export function useSchedulesByDate(date: string) {
  const {
    isLoading,
    data: schedules = [],
    error,
  } = useQuery({
    queryKey: ["schedules", date],
    queryFn: () => getSchedulesByDate(date),
    enabled: !!date,
  });

  return {
    isLoading,
    schedules,
    error,
  };
}