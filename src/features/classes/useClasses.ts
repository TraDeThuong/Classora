import { useQuery } from "@tanstack/react-query";
import { getClasses } from "../../services/apiClasses";

export function useClasses () {
    const {isLoading, data:classes =[], error} = useQuery ({
        queryKey : ['classes'],
        queryFn : getClasses,
        staleTime: 0
  })

  return {isLoading, error, classes}
}   