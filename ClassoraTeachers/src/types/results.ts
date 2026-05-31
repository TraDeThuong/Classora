export type ResultStatus =
  | "pending"
  | "late"
  | "missing"
  | "graded";

export interface Result {
  id: number;
  created_at: string;

  assignment_id: number;
  student_id: number;

  score: number | null;

  feedback: string | null;

  submitted_at: string | null;

  status: ResultStatus;

  // Computed fields
  student_name?: string;
  assignment_title?: string;
  class_name?: string;
}