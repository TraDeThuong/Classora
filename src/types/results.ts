import type { AssignmentQuestion } from "./assignments";

export type ResultStatus =
  | "pending"
  | "late"
  | "missing"
  | "graded";

export type StudentAssignmentStatus =
  | "not_started"
  | "submitted"
  | "late"
  | "graded"
  | "closed";

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

export interface ResultAnswer {
  questionId: string;
  type: "mcq" | "essay";
  selectedOption?: number;
  text?: string;
  score?: number;
}

export interface AssignmentResultRow {
  result_id: number | null;
  assignment_id: number;
  assignment_title: string;
  total_score: number;
  due_date: string | null;
  student_id: number;
  student_name: string;
  student_email: string;
  avatar_url: string | null;
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
  status: ResultStatus;
  answers: ResultAnswer[];
  questions: AssignmentQuestion[];
  isVirtual: boolean;
}

export interface GradeResultData {
  resultId: number;
  score: number;
  feedback: string | null;
}

export interface StudentAssignment {
  id: number;
  class_id: number;
  class_name: string;
  title: string;
  description: string | null;
  type: "mcq" | "essay" | "mixed";
  total_score: number;
  due_date: string | null;
  allow_late_submit: boolean;
  published_at: string | null;
  questions: AssignmentQuestion[];
  teacher_name: string | null;
  result_id: number | null;
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
  result_status: ResultStatus | null;
  student_status: StudentAssignmentStatus;
  answers: ResultAnswer[];
}

export interface SubmitAssignmentData {
  assignmentId: number;
  answers: ResultAnswer[];
}
