import { useQuery } from "@tanstack/react-query";
import { getAssignments } from "../../services/apiAssignments";

export function useAssignments () {
    const {isLoading, data:assignments =[], error} = useQuery ({
        queryKey : ['assignments'],
        queryFn : getAssignments,
        staleTime: 0
  })

  return {isLoading, error, assignments}
}   