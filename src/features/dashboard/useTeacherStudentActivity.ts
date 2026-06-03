import { useQuery } from "@tanstack/react-query";
import { getTeacherStudentActivity } from "../../services/apiTeacherActivity";

export function useTeacherStudentActivity() {
  const {
    data: activities = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["teacher-student-activity"],
    queryFn: getTeacherStudentActivity,
  });

  return { activities, error, isLoading };
}
