import { useQuery } from "@tanstack/react-query";
import { getCurrentTeacher } from "../../services/apiAuth";

export default function useTeacher() {
  const { isLoading, data: teacher } = useQuery({
    queryKey: ["teacher"],
    queryFn: getCurrentTeacher,
  });

  return {
    isLoading,
    teacher,
    isAuthenticated: !!teacher,
  };
}