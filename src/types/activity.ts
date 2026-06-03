import type { ResultStatus } from "./results";

export type TeacherStudentActivityType =
  | "joined_class"
  | "submitted_assignment";

export interface TeacherStudentActivity {
  id: string;
  type: TeacherStudentActivityType;
  studentName: string;
  studentEmail: string;
  studentAvatar: string | null;
  className: string;
  classId?: number;
  assignmentTitle?: string;
  assignmentId?: number;
  status?: ResultStatus;
  createdAt: string;
}