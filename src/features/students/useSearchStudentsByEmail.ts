import { useQuery } from "@tanstack/react-query";
import { searchStudentsByEmail } from "../../services/apiStudents";

export function useSearchStudentsByEmail(email: string, classId: number) {
  const {
    isLoading,
    data: students = [],
    error,
  } = useQuery({
    queryKey: ["students", "search", email, classId],
    queryFn: () => searchStudentsByEmail(email, classId),
    enabled: email.length >= 2 && !!classId,
  });

  return { isLoading, students, error };
}