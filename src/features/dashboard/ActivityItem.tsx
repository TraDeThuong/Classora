import { HiAcademicCap, HiClipboardDocumentList } from "react-icons/hi2";
import type { TeacherStudentActivity } from "../../types/activity";
import type { ResultStatus } from "../../types/results";
import { Link } from "react-router-dom";

const statusStyles: Record<ResultStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  late: "bg-red-100 text-red-700",
  missing: "bg-slate-100 text-slate-700",
  graded: "bg-emerald-100 text-emerald-700",
};


function formatActivityTime(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}


 function ActivityIcon({ activity }: { activity: TeacherStudentActivity }) {
  const Icon =
    activity.type === "joined_class"
      ? HiAcademicCap
      : HiClipboardDocumentList;

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-300/10 text-xl text-brand-300">
      <Icon />
    </div>
  );
}



export function ActivityItem({ activity }: { activity: TeacherStudentActivity }) {
  const isSubmission = activity.type === "submitted_assignment";

  const to = isSubmission
  ? `/teacher/assignments/${activity.assignmentId}`
  : `/teacher/classes/${activity.classId}`;

  return (
    <Link
        to={to}
        className="flex gap-3 rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
        >
      <ActivityIcon activity={activity} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-semibold text-brand-300">
              {activity.studentName}
            </p>
            <p className="truncate text-sm text-brand-300/60">
              {activity.studentEmail}
            </p>
          </div>

          <span className="shrink-0 text-xs font-semibold text-brand-300/60">
            {formatActivityTime(activity.createdAt)}
          </span>
        </div>

        <p className="mt-2 text-sm text-brand-300/80">
          {isSubmission ? "Submitted" : "Joined class"}{" "}
          <span className="font-semibold">
            {isSubmission ? activity.assignmentTitle : activity.className}
          </span>
        </p>

        {isSubmission && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-brand-300/60">
              {activity.className}
            </span>
            {activity.status && (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[activity.status]}`}
              >
                {activity.status}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}