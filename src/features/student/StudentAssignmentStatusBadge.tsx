import type { StudentAssignmentStatus } from "../../types/results";

const statusConfig: Record<StudentAssignmentStatus, string> = {
  not_started: "bg-blue-500/15 text-blue-700",
  submitted: "bg-yellow-500/20 text-yellow-700",
  late: "bg-orange-500/20 text-orange-700",
  graded: "bg-green-500/20 text-green-700",
  closed: "bg-red-500/20 text-red-700",
};

const labels: Record<StudentAssignmentStatus, string> = {
  not_started: "Open",
  submitted: "Submitted",
  late: "Late",
  graded: "Graded",
  closed: "Closed",
};

export default function StudentAssignmentStatusBadge({
  status,
}: {
  status: StudentAssignmentStatus;
}) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold ${statusConfig[status]}`}
    >
      {labels[status]}
    </span>
  );
}
