import supabase from "./supabase";

interface AddStudentToClassData {
  classId: number;
  studentId: number;
}

export async function addStudentToClass({
  classId,
  studentId,
}: AddStudentToClassData) {
  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("max_students")
    .eq("id", classId)
    .single();

  if (classError) {
    throw new Error("Could not load class information");
  }

  const { count, error: countError } = await supabase
    .from("class_students")
    .select("*", { count: "exact", head: true })
    .eq("class_id", classId);

  if (countError) {
    throw new Error("Could not count students");
  }

  if ((count ?? 0) >= classData.max_students) {
    throw new Error("Class is full");
  }

  const { data, error } = await supabase
    .from("class_students")
    .insert([
      {
        class_id: classId,
        student_id: studentId,
        status: "active",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("addStudentToClassError:", error);
    throw new Error("Student could not be added to class");
  }

  return data;
}

export async function deleteClassStudent(classStudentId: number) {
  const { error } = await supabase
    .from("class_students")
    .delete()
    .eq("id", classStudentId);

  if (error) {
    console.error("deleteClassStudentError:", error);
    throw new Error("Student could not be removed from class");
  }
}