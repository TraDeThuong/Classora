import { useQuery } from "@tanstack/react-query"
import { getSchedules } from "../../services/apiCalendars"

export function useSchedules () {
    const {isLoading, data:schedules =[], error} = useQuery ({
        queryKey : ['schedules'],
        queryFn : getSchedules,
        staleTime: 0
  })

  return {isLoading, error,schedules}
}   