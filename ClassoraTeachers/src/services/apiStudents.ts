import supabase from "./supabase";

export async function searchStudentsByEmail(email: string, classId: number) {
  if (!email || email.length < 2) return [];

  const { data: classStudents, error: classStudentsError } = await supabase
    .from("class_students")
    .select("student_id")
    .eq("class_id", classId);

  if (classStudentsError) {
    console.error("classStudentsError:", classStudentsError);
    throw new Error("Class students could not be loaded");
  }

  const existingStudentIds =
    classStudents?.map((item) => item.student_id) ?? [];

  let query = supabase
    .from("students")
    .select("id, full_name, email, avatar_url, status")
    .ilike("email", `%${email}%`)
    .eq("status", "active")
    .limit(5);

  if (existingStudentIds.length > 0) {
    query = query.not("id", "in", `(${existingStudentIds.join(",")})`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("searchStudentsByEmailError:", error);
    throw new Error("Students could not be loaded");
  }

  return data;
}

export async function getStudentsByClassId(classId: number) {
  const { data, error } = await supabase
    .from("class_students")
    .select(`
      id,
      class_id,
      student_id,
      status,
      students (
        id,
        full_name,
        email,
        avatar_url,
        status
      )
    `)
    .eq("class_id", classId);

  if (error) {
    console.error("studentsByClassError:", error);
    throw new Error("Students could not be loaded");
  }

  return data;
}

export async function getStudentsByTeacher() {
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
    .from("classes")
    .select(`
      id,
      class_students (
        id,
        student_id,
        status,
        students (
          id,
          full_name,
          email,
          avatar_url,
          status
        )
      )
    `)
    .eq("teacher_id", teacher.id);

  if (error) {
    console.error("studentsByTeacherError:", error);
    throw new Error("Students could not be loaded");
  }

  const studentsMap = new Map();

  data.forEach((classItem) => {
    classItem.class_students?.forEach((classStudent: any) => {
      const student = classStudent.students;

      if (student) {
        studentsMap.set(student.id, student);
      }
    });
  });

  return Array.from(studentsMap.values());
}