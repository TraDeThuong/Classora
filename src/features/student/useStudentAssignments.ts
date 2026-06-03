import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getStudentAssignmentDetail,
  getStudentAssignments,
  getStudentResults,
  submitStudentAssignment,
} from "../../services/apiStudentPortal";

export function useStudentAssignments() {
  const {
    data: assignments = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["student-assignments"],
    queryFn: getStudentAssignments,
  });

  return { assignments, error, isLoading };
}

export function useStudentAssignment(assignmentId: number) {
  const {
    data: assignment,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["student-assignment", assignmentId],
    queryFn: () => getStudentAssignmentDetail(assignmentId),
    enabled: !!assignmentId,
  });

  return { assignment, error, isLoading };
}

export function useSubmitStudentAssignment(assignmentId: number) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: submitAssignment, isPending } = useMutation({
    mutationFn: submitStudentAssignment,
    onSuccess: () => {
      toast.success("Assignment submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["student-assignments"] });
      queryClient.invalidateQueries({
        queryKey: ["student-assignment", assignmentId],
      });
      queryClient.invalidateQueries({ queryKey: ["student-results"] });
      navigate(`/student/assignments/${assignmentId}`);
    },
    onError: (error) => {
      console.error("submitStudentAssignmentError:", error);
      toast.error(error.message);
    },
  });

  return { isPending, submitAssignment };
}

export function useStudentResults() {
  const {
    data: results = [],
    error,
    isLoading,
  } = useQuery({
    queryKey: ["student-results"],
    queryFn: getStudentResults,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    staleTime: 0,
  });

  return { error, isLoading, results };
}