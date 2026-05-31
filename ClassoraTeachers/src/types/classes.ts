export interface Class {
  id: number;
  created_at: string; // timestamptz

  teacher_id: number;

  class_name: string;
  class_code: string;

  description: string | null;

  max_students: number;

  room: string | null;
  thumbnail: string | null;

  start_date: string; // date
  end_date: string; // date

  status: "active" | "inactive" | "completed" | "archived";
}