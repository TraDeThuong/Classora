import type { TeacherStudentActivity } from "../types/activity";
import type { ResultStatus } from "../types/results";
import supabase from "./supabase";

interface StudentRelation {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface JoinedClassRecord {
  id: number;
  created_at: string;
  class_id: number;
  students: StudentRelation | StudentRelation[] | null;
  classes: {
    class_name: string;
  } | {
    class_name: string;
  }[] | null;
}

interface SubmittedAssignmentRecord {
  id: number;
  submitted_at: string | null;
  status: ResultStatus;
  assignment_id: number;
  students: StudentRelation | StudentRelation[] | null;
  assignments: {
    title: string;
    classes: {
      class_name: string;
    } | {
      class_name: string;
    }[] | null;
  } | {
    title: string;
    classes: {
      class_name: string;
    } | {
      class_name: string;
    }[] | null;
  }[] | null;
}

function getSingle<T>(value: T | T[] | null) {
  if (Array.isArray(value)) return value[0] ?? null;
  return value;
}

async function getCurrentTeacherId() {
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
    console.error("teacherActivityTeacherError:", teacherError);
    throw new Error("Teacher profile could not be loaded");
  }

  return teacher.id as number;
}

function getStudentName(student: StudentRelation | null) {
  return student?.full_name || student?.email || "Unknown student";
}

function toJoinedClassActivity(
  record: JoinedClassRecord,
): TeacherStudentActivity | null {
  const student = getSingle(record.students);
  const classData = getSingle(record.classes);

  if (!classData) return null;

  return {
    id: `joined-${record.id}`,
    type: "joined_class",
    classId: record.class_id,
    studentName: getStudentName(student),
    studentEmail: student?.email ?? "No email",
    studentAvatar: student?.avatar_url ?? null,
    className: classData.class_name,
    createdAt: record.created_at,
  };
}

function toSubmittedAssignmentActivity(
  record: SubmittedAssignmentRecord,
): TeacherStudentActivity | null {
  const student = getSingle(record.students);
  const assignment = getSingle(record.assignments);
  const classData = getSingle(assignment?.classes ?? null);

  if (!record.submitted_at || !assignment || !classData) return null;

  return {
    id: `submitted-${record.id}`,
    type: "submitted_assignment",
    studentName: getStudentName(student),
    assignmentId: record.assignment_id,
    studentEmail: student?.email ?? "No email",
    studentAvatar: student?.avatar_url ?? null,
    className: classData.class_name,
    assignmentTitle: assignment.title,
    status: record.status,
    createdAt: record.submitted_at,
  };
}

export async function getTeacherStudentActivity(): Promise<
  TeacherStudentActivity[]
> {
  const teacherId = await getCurrentTeacherId();

  const { data: joinedRecords, error: joinedError } = await supabase
    .from("class_students")
    .select(`
      id,
      class_id,
      created_at,
      students (
        full_name,
        email,
        avatar_url
      ),
      classes!inner (
        class_name,
        teacher_id
      )
    `)
    .eq("classes.teacher_id", teacherId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (joinedError) {
    console.error("teacherJoinedClassActivityError:", joinedError);
    throw new Error("Student activity could not be loaded");
  }

  const { data: submittedRecords, error: submittedError } = await supabase
    .from("results")
    .select(`
      id,
      assignment_id,
      submitted_at,
      status,
      students (
        full_name,
        email,
        avatar_url
      ),
      assignments!inner (
        title,
        teacher_id,
        classes (
          class_name
        )
      )
    `)
    .eq("assignments.teacher_id", teacherId)
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(10);

  if (submittedError) {
    console.error("teacherSubmittedActivityError:", submittedError);
    throw new Error("Student activity could not be loaded");
  }

  return [
    ...((joinedRecords ?? []) as unknown as JoinedClassRecord[])
      .map(toJoinedClassActivity)
      .filter((activity): activity is TeacherStudentActivity =>
        Boolean(activity),
      ),
    ...((submittedRecords ?? []) as unknown as SubmittedAssignmentRecord[])
      .map(toSubmittedAssignmentActivity)
      .filter((activity): activity is TeacherStudentActivity =>
        Boolean(activity),
      ),
  ]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, 10);
}
