import supabase from "./supabase";

interface AddStudentToClassData {
  classId: number;
  studentId: number;
}

export async function addStudentToClass({
  classId,
  studentId,
}: AddStudentToClassData) {
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