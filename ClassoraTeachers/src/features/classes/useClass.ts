import { useQuery } from "@tanstack/react-query";
import { getClassByClassId } from "../../services/apiClasses";

export function useClass(classId: number | null) {
  const {isLoading, data: classData, error,} = useQuery({
    queryKey: ["class", classId],
    queryFn: () => getClassByClassId(classId!),
    enabled: !!classId,
  });

  return {
    isLoading,
    error,
    classData,
  };
}