import { useQuery } from "@tanstack/react-query";
import { getStudentsByClassId } from "../../services/apiStudents";

export function useStudentsByClass(classId: number) {
  const {
    isLoading,
    data: students = [],
    error,
  } = useQuery({
    queryKey: ["class-students", classId],
    queryFn: () => getStudentsByClassId(classId),
    enabled: !!classId,
  });

  return { isLoading, students, error };
}