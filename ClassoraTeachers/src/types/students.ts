export type StudentStatus =
  | "active"
  | "inactive"
  | "graduated"
  | "banned";
  

export interface Student {
  id: number;
  created_at: string;

  full_name: string;
  email: string;

  avatar_url: string | null;
  google_id: string | null;

  date_of_birth: string | null;

  status: StudentStatus;

  // dữ liệu hiển thị UI
  class_count?: number;
  assignment_count?: number;
  average_score?: number;
}