export type TeacherStatus =
  | "active"
  | "inactive"
  | "retired"
  | "suspended";

export interface Teacher {
  id: number;
  created_at: string;

  full_name: string;
  email: string;

  avatar_url: string | null;
  google_id: string | null;

  specialization: string | null;
  bio: string | null;

  status: TeacherStatus;

  degree: string | null;
  phone: string | null;

  // Computed fields (không lưu DB)
  classes_count?: number;
  students_count?: number;
  assignments_count?: number;
}