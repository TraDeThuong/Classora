import { useQuery } from "@tanstack/react-query";
import { getStudentsByTeacher } from "../../services/apiStudents";

export function useStudentsByTeacher() {
  const {
    isLoading,
    data: students = [],
    error,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getStudentsByTeacher,
  });

  return {
    isLoading,
    students,
    error,
  };
}