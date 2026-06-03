import { Link } from "react-router-dom";
import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import StudentAssignmentStatusBadge from "../../features/student/StudentAssignmentStatusBadge";
import { useStudentAssignments } from "../../features/student/useStudentAssignments";
import type { StudentAssignmentStatus } from "../../types/results";

const statusOrder: StudentAssignmentStatus[] = [
  "not_started",
  "submitted",
  "late",
  "graded",
  "closed",
];

export default function StudentAssignments() {
  const { assignments, error, isLoading } = useStudentAssignments();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message="Assignments could not be loaded." />;

  const sortedAssignments = [...assignments].sort((first, second) => {
    const firstIndex = statusOrder.indexOf(first.student_status);
    const secondIndex = statusOrder.indexOf(second.student_status);

    if (firstIndex !== secondIndex) return firstIndex - secondIndex;

    return (
      new Date(first.due_date ?? "9999-12-31").getTime() -
      new Date(second.due_date ?? "9999-12-31").getTime()
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-brand-300">Assignments</h1>
        <p className="mt-2 text-brand-300/70">
          Complete published assignments from your classes.
        </p>
      </div>

      {!sortedAssignments.length ? (
        <Empty resourceName="assignments" />
      ) : (
        <div className="grid gap-4">
          {sortedAssignments.map((assignment) => (
            <Link
              key={assignment.id}
              to={`/student/assignments/${assignment.id}`}
              className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-bold text-brand-300">
                      {assignment.title}
                    </h2>
                    <StudentAssignmentStatusBadge
                      status={assignment.student_status}
                    />
                  </div>
                  <p className="text-brand-300/70">
                    {assignment.description || "No description."}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-brand-200">
                    {assignment.class_name} · {assignment.type.toUpperCase()}
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <p className="font-semibold text-brand-300">
                    {assignment.total_score} pts
                  </p>
                  <p className="text-sm text-brand-300/70">
                    {assignment.due_date
                      ? new Date(assignment.due_date).toLocaleString("vi-VN")
                      : "No due date"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
