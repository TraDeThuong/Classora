import type { AssignmentQuestion } from "../types/assignments";
import type {
  Result,
  ResultAnswer,
  ResultStatus,
  StudentAssignment,
  StudentAssignmentStatus,
  SubmitAssignmentData,
} from "../types/results";
import type { StudentSchedule } from "../types/schedule";
import type { Student, StudentClass } from "../types/students";
import { getCurrentStudent } from "./apiAuth";
import supabase from "./supabase";

interface ClassRelation {
  id: number;
  class_name: string;
  class_code: string;
  description: string | null;
  room: string | null;
  thumbnail: string | null;
  start_date: string;
  end_date: string;
  status: StudentClass["class_status"];
  teachers: { full_name: string | null } | { full_name: string | null }[] | null;
}

interface RawStudentClass {
  id: number;
  status: StudentClass["enrollment_status"];
  class_id: number;
  classes: ClassRelation | ClassRelation[] | null;
}

interface AssignmentRelation {
  id: number;
  class_id: number;
  title: string;
  description: string | null;
  type: "mcq" | "essay" | "mixed";
  total_score: number;
  due_date: string | null;
  allow_late_submit: boolean;
  published_at: string | null;
  questions: AssignmentQuestion[];
  classes: {
    class_name: string;
    teachers: { full_name: string | null } | { full_name: string | null }[] | null;
  } | {
    class_name: string;
    teachers: { full_name: string | null } | { full_name: string | null }[] | null;
  }[] | null;
}

interface ResultRecord extends Result {
  answers?: ResultAnswer[] | null;
}

interface ScheduleRelation {
  id: number;
  class_id: number;
  title: string;
  note: string | null;
  teaching_date: string;
  start_time: string;
  end_time: string;
  location: string | null;
  status: StudentSchedule["status"] | null;
  classes: {
    id: number;
    class_name: string;
    class_code: string;
    teachers: { full_name: string | null } | { full_name: string | null }[] | null;
  } | {
    id: number;
    class_name: string;
    class_code: string;
    teachers: { full_name: string | null } | { full_name: string | null }[] | null;
  }[] | null;
}

function getSingle<T>(value: T | T[] | null) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

function getTeacherName(
  teacher: { full_name: string | null } | { full_name: string | null }[] | null,
) {
  return getSingle(teacher)?.full_name ?? null;
}

function sanitizeQuestions(questions: AssignmentQuestion[] = []) {
  return questions.map((question) => ({
    id: question.id,
    order: question.order,
    type: question.type,
    questionText: question.questionText,
    points: question.points,
    options: question.options,
  }));
}

async function requireStudent(): Promise<Student> {
  const student = await getCurrentStudent();
  if (!student) throw new Error("Student profile could not be loaded");
  return student;
}

function getStudentAssignmentStatus(
  assignment: Pick<StudentAssignment, "due_date" | "allow_late_submit">,
  result?: ResultRecord,
): StudentAssignmentStatus {
  if (result?.status === "graded") return "graded";
  if (result?.submitted_at) {
    if (result.status === "late") return "late";
    return "submitted";
  }

  if (
    assignment.due_date &&
    new Date(assignment.due_date) < new Date() &&
    !assignment.allow_late_submit
  ) {
    return "closed";
  }

  return "not_started";
}

function toStudentAssignment(
  assignment: AssignmentRelation,
  result?: ResultRecord,
): StudentAssignment {
  const classData = getSingle(assignment.classes);

  return {
    id: assignment.id,
    class_id: assignment.class_id,
    class_name: classData?.class_name ?? "Unknown class",
    title: assignment.title,
    description: assignment.description,
    type: assignment.type,
    total_score: assignment.total_score,
    due_date: assignment.due_date,
    allow_late_submit: assignment.allow_late_submit,
    published_at: assignment.published_at,
    questions: sanitizeQuestions(assignment.questions),
    teacher_name: getTeacherName(classData?.teachers ?? null),
    result_id: result?.id ?? null,
    score: result?.score ?? null,
    feedback: result?.feedback ?? null,
    submitted_at: result?.submitted_at ?? null,
    result_status: result?.status ?? null,
    student_status: getStudentAssignmentStatus(assignment, result),
    answers: result?.answers ?? [],
  };
}

export async function getStudentClasses(): Promise<StudentClass[]> {
  const student = await requireStudent();

  const { data, error } = await supabase
    .from("class_students")
    .select(`
      id,
      status,
      class_id,
      classes (
        id,
        class_name,
        class_code,
        description,
        room,
        thumbnail,
        start_date,
        end_date,
        status,
        teachers (
          full_name
        )
      )
    `)
    .eq("student_id", student.id);

  if (error) {
    console.error("studentClassesError:", error);
    throw new Error("Student classes could not be loaded");
  }

  return ((data ?? []) as unknown as RawStudentClass[])
    .map((enrollment) => ({
      ...enrollment,
      classes: getSingle(enrollment.classes),
    }))
    .filter((enrollment) => enrollment.classes)
    .map((enrollment) => {
      const classData = enrollment.classes as ClassRelation;

      return {
        enrollment_id: enrollment.id,
        enrollment_status: enrollment.status,
        class_id: classData.id,
        class_name: classData.class_name,
        class_code: classData.class_code,
        description: classData.description,
        room: classData.room,
        thumbnail: classData.thumbnail,
        start_date: classData.start_date,
        end_date: classData.end_date,
        class_status: classData.status,
        teacher_name: getTeacherName(classData.teachers),
      };
    });
}

export async function joinClassByCode(classCode: string) {
  const student = await requireStudent();
  const normalizedCode = classCode.trim().toUpperCase();

  if (!normalizedCode) throw new Error("Class code is required");

  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("id, status")
    .eq("class_code", normalizedCode)
    .single();

  if (classError || !classData) {
    throw new Error("Class code was not found");
  }

  if (classData.status === "archived") {
    throw new Error("Archived classes cannot be joined");
  }

  const { data: existingEnrollment, error: existingError } = await supabase
    .from("class_students")
    .select("id")
    .eq("class_id", classData.id)
    .eq("student_id", student.id)
    .maybeSingle();

  if (existingError) throw new Error(existingError.message);

  if (existingEnrollment) {
    throw new Error("You already joined this class");
  }

  const { data, error } = await supabase
    .from("class_students")
    .insert([
      {
        class_id: classData.id,
        student_id: student.id,
        status: "active",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("joinClassByCodeError:", error);
    throw new Error("Class could not be joined");
  }

  return data;
}

async function getStudentClassIds(studentId: number) {
  const { data, error } = await supabase
    .from("class_students")
    .select("class_id")
    .eq("student_id", studentId)
    .eq("status", "active");

  if (error) throw new Error(error.message);

  return (data ?? []).map((item) => item.class_id as number);
}

export async function getStudentAssignments(): Promise<StudentAssignment[]> {
  const student = await requireStudent();
  const classIds = await getStudentClassIds(student.id);

  if (!classIds.length) return [];

  const { data: assignments, error: assignmentsError } = await supabase
    .from("assignments")
    .select(`
      id,
      class_id,
      title,
      description,
      type,
      total_score,
      due_date,
      allow_late_submit,
      published_at,
      questions,
      classes (
        class_name,
        teachers (
          full_name
        )
      )
    `)
    .in("class_id", classIds)
    .eq("status", "published")
    .order("due_date", { ascending: true });

  if (assignmentsError) {
    console.error("studentAssignmentsError:", assignmentsError);
    throw new Error("Student assignments could not be loaded");
  }

  const assignmentIds = (assignments ?? []).map((assignment) => assignment.id);

  if (!assignmentIds.length) return [];

  const { data: results, error: resultsError } = await supabase
    .from("results")
    .select("*")
    .eq("student_id", student.id)
    .in("assignment_id", assignmentIds);

  if (resultsError) {
    console.error("studentAssignmentResultsError:", resultsError);
    throw new Error("Student results could not be loaded");
  }

  const resultsByAssignment = new Map<number, ResultRecord>();

  ((results ?? []) as ResultRecord[]).forEach((result) => {
    resultsByAssignment.set(result.assignment_id, result);
  });

  return ((assignments ?? []) as unknown as AssignmentRelation[]).map(
    (assignment) =>
      toStudentAssignment(assignment, resultsByAssignment.get(assignment.id)),
  );
}

export async function getStudentAssignmentDetail(
  assignmentId: number,
): Promise<StudentAssignment> {
  const assignments = await getStudentAssignments();
  const assignment = assignments.find((item) => item.id === assignmentId);

  if (!assignment) throw new Error("Assignment could not be loaded");

  return assignment;
}

export async function submitStudentAssignment({
  assignmentId,
  answers,
}: SubmitAssignmentData) {
  const student = await requireStudent();
  const assignment = await getStudentAssignmentDetail(assignmentId);

  if (
    assignment.due_date &&
    new Date(assignment.due_date) < new Date() &&
    !assignment.allow_late_submit
  ) {
    throw new Error("This assignment no longer accepts submissions");
  }

  const nextStatus: ResultStatus =
    assignment.due_date && new Date(assignment.due_date) < new Date()
      ? "late"
      : "pending";

  const submittedAt = new Date().toISOString();

  if (assignment.result_status === "graded") {
    throw new Error("Graded assignments cannot be resubmitted");
  }

  const { data, error } = await supabase
    .from("results")
    .upsert(
      {
        assignment_id: assignmentId,
        student_id: student.id,
        answers,
        feedback: null,
        score: null,
        status: nextStatus,
        submitted_at: submittedAt,
      },
      {
        onConflict: "assignment_id,student_id",
      },
    )
    .select()
    .single();

  if (error) {
    console.error("submitAssignmentError:", error);
    throw new Error(error.message || "Assignment could not be submitted");
  }

  return data;
}

export async function getStudentResults() {
  const assignments = await getStudentAssignments();

  return assignments.filter((assignment) => assignment.result_id);
}

export async function getStudentSchedules(): Promise<StudentSchedule[]> {
  const student = await requireStudent();
  const classIds = await getStudentClassIds(student.id);

  if (!classIds.length) return [];

  const { data, error } = await supabase
    .from("calendars")
    .select(`
      id,
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
        class_name,
        class_code,
        teachers (
          full_name
        )
      )
    `)
    .in("class_id", classIds)
    .order("teaching_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("studentSchedulesError:", error);
    throw new Error("Student schedules could not be loaded");
  }

  return ((data ?? []) as unknown as ScheduleRelation[])
    .map((schedule) => {
      const classData = getSingle(schedule.classes);

      if (!classData) return null;

      return {
        id: schedule.id,
        class_id: schedule.class_id,
        class_name: classData.class_name,
        class_code: classData.class_code,
        teacher_name: getTeacherName(classData.teachers),
        title: schedule.title,
        note: schedule.note,
        teaching_date: schedule.teaching_date,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        location: schedule.location,
        status: schedule.status ?? "scheduled",
      };
    })
    .filter((schedule): schedule is StudentSchedule => Boolean(schedule));
}

export async function updateStudentProfile({
  full_name,
  avatar_url,
  date_of_birth,
}: {
  full_name: string;
  avatar_url: string;
  date_of_birth: string;
}) {
  const student = await requireStudent();

  const { data, error } = await supabase
    .from("students")
    .update({
      full_name,
      avatar_url,
      date_of_birth,
    })
    .eq("id", student.id)
    .select()
    .single();

  if (error) {
    console.error("updateStudentProfileError:", error);
    throw new Error("Student profile could not be updated");
  }

  return data;
}