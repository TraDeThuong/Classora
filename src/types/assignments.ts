export interface Assignment {
  id: number;

  created_at: string;

  class_id: number;
  teacher_id: number;

  title: string;
  description: string | null;

  type: "mcq" | "essay" | "mixed";

  total_score: number;

  due_date: string | null;

  allow_late_submit: boolean;

  published_at: string | null;

  status: "draft" | "published" | "archived";

  questions: AssignmentQuestion[];
}

export type AssignmentStatus = "draft" | "published" | "archived";

export type DisplayAssignmentStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "closed"
  | "archived";

export interface AssignmentQuestion {
  id: string;
  order: number;

  type: "mcq" | "essay";

  questionText: string;

  points: number;

  options?: string[];

  correctAnswer?: number;
}
