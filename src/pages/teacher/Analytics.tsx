import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import { useAssignments } from "../../features/assignments/useAssignments";
import { useClasses } from "../../features/classes/useClasses";
import { useTeacherResults } from "../../features/results/useTeacherResults";
import { useStudentsByTeacher } from "../../features/students/StudentsByTeacher";
import type { Assignment } from "../../types/assignments";

function countBy<T extends string>(items: T[]) {
  return items.reduce(
    (counts, item) => ({
      ...counts,
      [item]: (counts[item] ?? 0) + 1,
    }),
    {} as Record<T, number>,
  );
}

function percent(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function AnalyticsCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase text-brand-200">{label}</p>
      <p className="mt-3 text-4xl font-bold text-brand-300">{value}</p>
    </div>
  );
}

function BreakdownBar({
  label,
  total,
  value,
}: {
  label: string;
  total: number;
  value: number;
}) {
  const width = percent(value, total);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-brand-300">
        <span className="font-semibold capitalize">{label}</span>
        <span>
          {value} · {width}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-white/70">
        <div
          className="h-full rounded-full bg-brand-300"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

function getUpcomingAssignments(assignments: Assignment[]) {
  const now = new Date();

  return assignments
    .filter((assignment) => {
      if (assignment.status === "archived" || !assignment.due_date) return false;
      return new Date(assignment.due_date) >= now;
    })
    .sort(
      (first, second) =>
        new Date(first.due_date!).getTime() -
        new Date(second.due_date!).getTime(),
    )
    .slice(0, 5);
}

export default function Analytics() {
  const {
    assignments,
    error: assignmentsError,
    isLoading: assignmentsLoading,
  } = useAssignments();
  const {
    classes,
    error: classesError,
    isLoading: classesLoading,
  } = useClasses();
  const {
    students,
    error: studentsError,
    isLoading: studentsLoading,
  } = useStudentsByTeacher();
  const {
    results,
    error: resultsError,
    isLoading: resultsLoading,
  } = useTeacherResults();

  if (
    assignmentsLoading ||
    classesLoading ||
    studentsLoading ||
    resultsLoading
  ) {
    return <Spinner />;
  }

  if (assignmentsError || classesError || studentsError || resultsError) {
    return <ErrorMessage message="Analytics data could not be loaded." />;
  }

  const hasNoData =
    !assignments.length && !classes.length && !students.length && !results.length;

  if (hasNoData) {
    return <Empty resourceName="analytics data" />;
  }

  const assignmentStatusCounts = countBy(assignments.map((item) => item.status));
  const assignmentTypeCounts = countBy(assignments.map((item) => item.type));
  const submittedResults = results.filter((result) => result.submitted_at);
  const gradedResults = results.filter((result) => result.status === "graded");
  const lateResults = results.filter((result) => result.status === "late");
  const pendingResults = results.filter(
    (result) => result.status !== "graded",
  );
  const averageScore = gradedResults.length
    ? (
        gradedResults.reduce((sum, result) => sum + (result.score ?? 0), 0) /
        gradedResults.length
      ).toFixed(1)
    : "0";

  const assignmentsByClass = classes.map((classItem) => ({
    classId: classItem.id,
    className: classItem.class_name,
    assignmentCount: assignments.filter(
      (assignment) => assignment.class_id === classItem.id,
    ).length,
  }));

  const upcomingAssignments = getUpcomingAssignments(assignments);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-brand-300">Analytics</h1>
        <p className="mt-2 text-brand-300/70">
          Track class, assignment, and submission performance.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        <AnalyticsCard label="Classes" value={classes.length} />
        <AnalyticsCard label="Students" value={students.length} />
        <AnalyticsCard label="Assignments" value={assignments.length} />
        <AnalyticsCard
          label="Published"
          value={assignmentStatusCounts.published ?? 0}
        />
        <AnalyticsCard label="Submitted" value={submittedResults.length} />
        <AnalyticsCard label="Graded" value={gradedResults.length} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-brand-300">
            Assignment Status
          </h2>
          <div className="space-y-5">
            {(["draft", "published", "archived"] as const).map((status) => (
              <BreakdownBar
                key={status}
                label={status}
                total={assignments.length}
                value={assignmentStatusCounts[status] ?? 0}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-brand-300">
            Assignment Type
          </h2>
          <div className="space-y-5">
            {(["mcq", "essay", "mixed"] as const).map((type) => (
              <BreakdownBar
                key={type}
                label={type}
                total={assignments.length}
                value={assignmentTypeCounts[type] ?? 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-brand-300">
            Submissions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <AnalyticsCard label="Late" value={lateResults.length} />
            <AnalyticsCard label="Ungraded" value={pendingResults.length} />
            <AnalyticsCard label="Average score" value={averageScore} />
            <AnalyticsCard
              label="Completion"
              value={`${percent(submittedResults.length, results.length)}%`}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-sm">
          <h2 className="mb-5 text-2xl font-bold text-brand-300">
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex flex-col justify-between gap-2 rounded-xl bg-white/70 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold text-brand-300">
                    {assignment.title}
                  </p>
                  <p className="text-sm capitalize text-brand-300/60">
                    {assignment.type} · {assignment.status}
                  </p>
                </div>
                <p className="text-sm font-semibold text-brand-200">
                  {new Date(assignment.due_date!).toLocaleString("vi-VN")}
                </p>
              </div>
            ))}
            {!upcomingAssignments.length && (
              <p className="text-brand-300/70">No upcoming deadlines.</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/50 bg-white/70 p-6 shadow-sm">
        <h2 className="mb-5 text-2xl font-bold text-brand-300">
          Classes Overview
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {assignmentsByClass.map((classItem) => (
            <div key={classItem.classId} className="rounded-xl bg-white/70 p-4">
              <p className="font-semibold text-brand-300">
                {classItem.className}
              </p>
              <p className="mt-1 text-sm text-brand-300/70">
                {classItem.assignmentCount} assignments
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
