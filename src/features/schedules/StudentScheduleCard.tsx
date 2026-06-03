
import type { StudentSchedule } from "../../types/schedule";

const statusStyles: Record<StudentSchedule["status"], string> = {
  scheduled: "bg-emerald-100 text-emerald-700",
  completed: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
};


function formatDate(date: string) {
  return new Date(date).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

export function StudentsScheduleCard({ schedule }: { schedule: StudentSchedule }) {
  return (
    <article className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-brand-300">
              {schedule.title}
            </h2>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                statusStyles[schedule.status]
              }`}
            >
              {schedule.status}
            </span>
          </div>

          <p className="font-semibold text-brand-200">
            {schedule.class_code} - {schedule.class_name}
          </p>
          <p className="mt-1 text-sm text-brand-300/70">
            Teacher: {schedule.teacher_name || "Unknown"}
          </p>

          {schedule.note && (
            <p className="mt-4 rounded-xl bg-brand-300/10 p-3 text-brand-300">
              {schedule.note}
            </p>
          )}
        </div>

        <div className="shrink-0 rounded-2xl bg-white/70 p-4 text-brand-300 md:min-w-72 md:text-right">
          <p className="font-bold">{formatDate(schedule.teaching_date)}</p>
          <p className="mt-1 text-2xl font-bold text-brand-200">
            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
          </p>
          <p className="mt-2 text-sm text-brand-300/70">
            {schedule.location || "Location not specified"}
          </p>
        </div>
      </div>
    </article>
  );
}