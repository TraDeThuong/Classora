export type StudentStatus =
  | "active"
  | "inactive"
  | "graduated"
  | "banned";
  

export interface Student {
  id: number;
  created_at: string;
  auth_user_id: string | null;

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

export interface TeacherStudentClass {
  id: number;
  class_name: string;
  class_code: string;
  status: StudentStatus;
}

export interface TeacherStudent extends Student {
  classes: TeacherStudentClass[];
  class_count: number;
}

export interface ClassStudent {
  id: number;
  class_id: number;
  student_id: number;
  status: StudentStatus;
  students: Student | null;
}

export interface StudentClass {
  enrollment_id: number;
  enrollment_status: StudentStatus;
  class_id: number;
  class_name: string;
  class_code: string;
  description: string | null;
  room: string | null;
  thumbnail: string | null;
  start_date: string;
  end_date: string;
  class_status: "active" | "inactive" | "completed" | "archived";
  teacher_name: string | null;
}
