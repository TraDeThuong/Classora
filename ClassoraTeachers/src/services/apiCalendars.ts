import supabase from "./supabase";

export async function getSchedules() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User not found");

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (teacherError) throw new Error(teacherError.message);
  if (!teacher) throw new Error("Teacher not found");

  const { data, error } = await supabase
    .from("calendars")
    .select(`
      id,
      created_at,
      teacher_id,
      class_id,
      title,
      note,
      teaching_date,
      start_time,
      end_time,
      location,
      status,
      classes (
        id,
        class_code,
        class_name
      )
    `)
    .eq("teacher_id", teacher.id)
    .order("teaching_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
}


export async function createSchedule(newSchedule: {
  class_id: number;
  title: string;
  note?: string;
  teaching_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  status?: string;
}) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User not found");

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (teacherError) throw new Error(teacherError.message);
  if (!teacher) throw new Error("Teacher not found");

  const { data, error } = await supabase
    .from("calendars")
    .insert([
      {
        ...newSchedule,
        teacher_id: teacher.id,
        status: newSchedule.status || "scheduled",
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getSchedulesByDate(date: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User not found");

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (teacherError) throw new Error(teacherError.message);
  if (!teacher) throw new Error("Teacher not found");

  const { data, error } = await supabase
    .from("calendars")
    .select(`
      *,
      classes (
        id,
        class_code,
        class_name
      )
    `)
    .eq("teacher_id", teacher.id)
    .eq("teaching_date", date)
    .order("start_time");

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteSchedule(id: number) {
  const { error } = await supabase
    .from("calendars")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Schedule could not be deleted");
  }
}

export async function updateScheduleStatus({
  id,
  status,
}: {
  id: number;
  status: "scheduled" | "completed" | "cancelled";
}) {
  const { data, error } = await supabase
    .from("calendars")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}