import { Link } from "react-router-dom";
import type { StudentAssignment } from "../../types/results";

export default function StudentClassAssignmentCard({
  assignment,
}: {
  assignment: StudentAssignment;
}) {
  return (
    <Link
      to={`/student/assignments/${assignment.id}`}
      className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-xl font-bold text-brand-300">
            {assignment.title}
          </h3>

          <p className="mt-1 text-sm text-brand-300/70">
            {assignment.description || "No description."}
          </p>

          <p className="mt-2 text-sm font-semibold text-brand-200">
            Status: {assignment.student_status}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-bold text-brand-300">
            {assignment.score !== null
              ? `${assignment.score}/${assignment.total_score}`
              : "Not graded"}
          </p>

          <p className="text-sm text-brand-300/70">
            {assignment.due_date
              ? new Date(assignment.due_date).toLocaleString("vi-VN")
              : "No due date"}
          </p>
        </div>
      </div>
    </Link>
  );
}