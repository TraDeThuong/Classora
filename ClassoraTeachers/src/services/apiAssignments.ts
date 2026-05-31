import supabase from "./supabase";


export interface AssignmentQuestion {
  id: string;
  order: number;
  type: "mcq" | "essay";
  questionText: string;
  points: number;
  options?: string[];
  correctAnswer?: number;
}

export interface NewAssignment {
  class_id: number;
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

export async function createAssignment(newAssignment: NewAssignment) {
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

  if (teacherError) {
    console.error(teacherError);
    throw new Error("Teacher profile could not be loaded");
  }

  const { data, error } = await supabase
    .from("assignments")
    .insert([
      {
        ...newAssignment,
        teacher_id: teacher.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Assignment could not be created");
  }

  return data;
}

//get Assignment by 
export async function getAssignments() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  if (!user) throw new Error("User not found");

  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("id, auth_user_id, full_name, email")
    .eq("auth_user_id", user.id)
    .single();

  if (teacherError) {
    console.error("teacherError:", teacherError);
    throw new Error("Teacher profile could not be loaded");
  }

  // console.log("teacher:", teacher);

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("teacher_id", teacher.id);

  if (error) {
    console.error("assignmentsError:", error);
    throw new Error("Assignments could not be loaded");
  }

    // console.log("assignments:", data);
    // console.log("teacher id:", teacher.id);
    // console.log("assignments:", data);

  return data;
}

export async function getAssignmentsByClassId(classId: number) {
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

  if (teacherError) {
    console.error("teacherError:", teacherError);
    throw new Error("Teacher profile could not be loaded");
  }

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("teacher_id", teacher.id)
    .eq("class_id", classId);

  if (error) {
    console.error("assignmentsByClassError:", error);
    throw new Error("Assignments by class could not be loaded");
  }

  return data;
}