import type { Assignment } from "../types/assignments";
import type { ClassStudent, Student } from "../types/students";
import type {
  AssignmentResultRow,
  GradeResultData,
  Result,
  ResultAnswer,
  ResultStatus,
} from "../types/results";
import supabase from "./supabase";

interface ResultRecord extends Result {
  answers?: ResultAnswer[] | null;
}

type StudentRelation = Student | Student[] | null;

interface RawClassStudent extends Omit<ClassStudent, "students"> {
  students: StudentRelation;
}

function getSingleStudent(students: StudentRelation) {
  if (Array.isArray(students)) return students[0] ?? null;
  return students;
}

function getDisplayStatus(
  result: ResultRecord | undefined,
  dueDate: string | null,
): ResultStatus {
  if (!result) {
    if (!dueDate) return "pending";
    return new Date(dueDate) < new Date() ? "missing" : "pending";
  }

  if (result.status === "graded") return "graded";

  if (!result.submitted_at) {
    if (!dueDate) return result.status;
    return new Date(dueDate) < new Date() ? "missing" : "pending";
  }

  if (dueDate && new Date(result.submitted_at) > new Date(dueDate)) {
    return "late";
  }

  return result.status;
}

export async function getAssignmentResults(
  assignmentId: number,
): Promise<AssignmentResultRow[]> {
  const { data: assignment, error: assignmentError } = await supabase
    .from("assignments")
    .select("*")
    .eq("id", assignmentId)
    .single();

  if (assignmentError) {
    console.error("assignmentResultsAssignmentError:", assignmentError);
    throw new Error("Assignment could not be loaded");
  }

  const typedAssignment = assignment as Assignment;

  const { data: classStudents, error: studentsError } = await supabase
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
    .eq("class_id", typedAssignment.class_id);

  if (studentsError) {
    console.error("assignmentResultsStudentsError:", studentsError);
    throw new Error("Class students could not be loaded");
  }

  const { data: results, error: resultsError } = await supabase
    .from("results")
    .select("*")
    .eq("assignment_id", assignmentId);

  if (resultsError) {
    console.error("assignmentResultsError:", resultsError);
    throw new Error("Assignment results could not be loaded");
  }

  const resultsByStudent = new Map<number, ResultRecord>();

  ((results ?? []) as ResultRecord[]).forEach((result) => {
    resultsByStudent.set(result.student_id, result);
  });

  return ((classStudents ?? []) as unknown as RawClassStudent[])
    .map((classStudent) => ({
      ...classStudent,
      students: getSingleStudent(classStudent.students),
    }))
    .filter((classStudent): classStudent is ClassStudent & { students: Student } =>
      Boolean(classStudent.students),
    )
    .map((classStudent) => {
      const student = classStudent.students;
      const result = resultsByStudent.get(classStudent.student_id);

      return {
        result_id: result?.id ?? null,
        assignment_id: assignmentId,
        assignment_title: typedAssignment.title,
        total_score: typedAssignment.total_score,
        due_date: typedAssignment.due_date,
        student_id: classStudent.student_id,
        student_name: student?.full_name ?? "Unknown student",
        student_email: student?.email ?? "No email",
        avatar_url: student?.avatar_url ?? null,
        score: result?.score ?? null,
        feedback: result?.feedback ?? null,
        submitted_at: result?.submitted_at ?? null,
        status: getDisplayStatus(result, typedAssignment.due_date),
        answers: result?.answers ?? [],
        questions: typedAssignment.questions ?? [],
        isVirtual: !result,
      };
    });
}

export async function gradeResult({
  resultId,
  score,
  feedback,
}: GradeResultData) {
  const { data, error } = await supabase
    .from("results")
    .update({
      score,
      feedback,
      status: "graded",
    })
    .eq("id", resultId)
    .select()
    .single();

  if (error) {
    console.error("gradeResultError:", error);
    throw new Error(error.message || "Result could not be graded");
  }

  return data;
}

export async function getTeacherResults(): Promise<ResultRecord[]> {
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
    console.error("teacherResultsTeacherError:", teacherError);
    throw new Error("Teacher profile could not be loaded");
  }

  const { data: assignments, error: assignmentsError } = await supabase
    .from("assignments")
    .select("id")
    .eq("teacher_id", teacher.id);

  if (assignmentsError) {
    console.error("teacherResultsAssignmentsError:", assignmentsError);
    throw new Error("Teacher assignments could not be loaded");
  }

  const assignmentIds = (assignments ?? []).map((assignment) => assignment.id);

  if (!assignmentIds.length) return [];

  const { data: results, error: resultsError } = await supabase
    .from("results")
    .select("*")
    .in("assignment_id", assignmentIds);

  if (resultsError) {
    console.error("teacherResultsError:", resultsError);
    throw new Error("Teacher results could not be loaded");
  }

  return (results ?? []) as ResultRecord[];
}
