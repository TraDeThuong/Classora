import type { ResultStatus } from "../../types/results";

const statusStyles: Record<ResultStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-200",
  late: "bg-orange-500/20 text-orange-200",
  missing: "bg-red-500/20 text-red-200",
  graded: "bg-green-500/20 text-green-200",
};

export default function ResultStatusBadge({ status }: { status: ResultStatus }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
