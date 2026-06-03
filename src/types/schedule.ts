

export type ScheduleStatus = "scheduled" | "completed" | "cancelled";

export interface Schedule {
  id: number;
  title: string;
  note?: string | null;
  teaching_date: string;
  start_time: string;
  end_time: string;
  location?: string | null;
  status?: ScheduleStatus | null;

  classes?: {
    id: number;
    class_code: string;
    class_name: string;
  } | null;
}

export interface StudentSchedule {
  id: number;
  class_id: number;
  class_name: string;
  class_code: string;
  teacher_name: string | null;
  title: string;
  note: string | null;
  teaching_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  status: ScheduleStatus;
}
