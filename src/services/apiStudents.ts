import supabase from "./supabase";
import type {
  ClassStudent,
  Student,
  TeacherStudent,
  TeacherStudentClass,
} from "../types/students";

type StudentRelation = Student | Student[] | null;

interface RawClassStudent extends Omit<ClassStudent, "students"> {
  students: StudentRelation;
}

function getSingleStudent(students: StudentRelation) {
  if (Array.isArray(students)) return students[0] ?? null;
  return students;
}

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

export async function getStudentsByClassId(
  classId: number,
): Promise<ClassStudent[]> {
  const { data, error } = await supabase
    .from("class_students")
    .select(`
      id,
      class_id,
      student_id,
      status,
      students (
        id,
        created_at,
        full_name,
        email,
        avatar_url,
        google_id,
        date_of_birth,
        status
      )
    `)
    .eq("class_id", classId);

  if (error) {
    console.error("studentsByClassError:", error);
    throw new Error("Students could not be loaded");
  }

  return ((data ?? []) as unknown as RawClassStudent[]).map((classStudent) => ({
    ...classStudent,
    students: getSingleStudent(classStudent.students),
  }));
}

interface TeacherClassStudentWithProfile
  extends Pick<ClassStudent, "id" | "student_id" | "status"> {
  students: StudentRelation;
}

interface TeacherClassWithStudents {
  id: number;
  class_name: string;
  class_code: string;
  class_students: TeacherClassStudentWithProfile[] | null;
}

export async function getStudentsByTeacher(): Promise<TeacherStudent[]> {
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
      class_name,
      class_code,
      class_students (
        id,
        student_id,
        status,
        students (
          id,
          created_at,
          full_name,
          email,
          avatar_url,
          google_id,
          date_of_birth,
          status
        )
      )
    `)
    .eq("teacher_id", teacher.id);

  if (error) {
    console.error("studentsByTeacherError:", error);
    throw new Error("Students could not be loaded");
  }

  const classItems = (data ?? []) as unknown as TeacherClassWithStudents[];
  const studentsMap = new Map<number, TeacherStudent>();

  classItems.forEach((classItem) => {
    classItem.class_students?.forEach((classStudent) => {
      const student = getSingleStudent(classStudent.students);

      if (student) {
        const studentClass: TeacherStudentClass = {
          id: classItem.id,
          class_name: classItem.class_name,
          class_code: classItem.class_code,
          status: classStudent.status,
        };

        const existingStudent = studentsMap.get(student.id);

        if (existingStudent) {
          existingStudent.classes.push(studentClass);
          existingStudent.class_count = existingStudent.classes.length;
          return;
        }

        studentsMap.set(student.id, {
          ...student,
          classes: [studentClass],
          class_count: 1,
        });
      }
    });
  });

  return Array.from(studentsMap.values());
}
