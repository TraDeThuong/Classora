import { Link } from "react-router-dom";
import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import { useStudentSchedules } from "../../features/student/useStudentSchedules";
import type { StudentSchedule } from "../../types/schedule";
import { StudentsScheduleCard } from "../../features/schedules/StudentScheduleCard";

function getScheduleDateTime(schedule: StudentSchedule) {
  const date = schedule.teaching_date.split("T")[0];
  const time = schedule.start_time.replace("+00", "");

  return new Date(`${date}T${time}`);
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isScheduled(schedule: StudentSchedule) {
  return schedule.status?.toLowerCase().trim() === "scheduled";
}

export default function StudentSchedules() {
  const { schedules, error, isLoading } = useStudentSchedules();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message="Schedules could not be loaded." />;

  const now = new Date();

  const todaySchedules = schedules.filter((schedule) =>
    isSameDay(getScheduleDateTime(schedule), now),
  );

  const todayAndUpcomingSchedules = schedules.filter((schedule) => {
    const scheduleDate = getScheduleDateTime(schedule);

    return (
      isScheduled(schedule) &&
      (isSameDay(scheduleDate, now) || scheduleDate > now)
    );
  });

  const pastOrClosedSchedules = schedules.filter((schedule) => {
    const scheduleDate = getScheduleDateTime(schedule);

    return (
      !isScheduled(schedule) ||
      (scheduleDate < now && !isSameDay(scheduleDate, now))
    );
  });

  const stats = [
    { label: "Today", value: todaySchedules.length },
    { label: "Upcoming", value: todayAndUpcomingSchedules.length },
    {
      label: "Completed",
      value: schedules.filter(
        (schedule) => schedule.status?.toLowerCase().trim() === "completed",
      ).length,
    },
    {
      label: "Cancelled",
      value: schedules.filter(
        (schedule) => schedule.status?.toLowerCase().trim() === "cancelled",
      ).length,
    },
  ];

console.log("TodayUpcoming", todayAndUpcomingSchedules);
console.log("PastClosed", pastOrClosedSchedules);
console.log(
  schedules.map((s) => ({
    id: s.id,
    status: s.status,
    date: s.teaching_date,
    start: s.start_time,
    parsed: getScheduleDateTime(s),
    isScheduled: s.status === "scheduled",
    isToday: isSameDay(getScheduleDateTime(s), now),
    isFuture: getScheduleDateTime(s) > now,
  }))
);


  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-4xl font-bold text-brand-300">Schedule</h1>
          <p className="mt-2 text-brand-300/70">
            View teaching sessions created by your teachers.
          </p>
        </div>

        <Link
          to="/student/classes"
          className="inline-flex w-fit rounded-xl bg-brand-300 px-5 py-3 font-semibold text-white hover:bg-brand-400"
        >
          Join more classes
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm"
          >
            <p className="text-sm font-semibold uppercase text-brand-200">
              {stat.label}
            </p>
            <p className="mt-3 text-4xl font-bold text-brand-300">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {!schedules.length ? (
        <Empty resourceName="schedules">
          <Link
            to="/student/classes"
            className="rounded-xl bg-brand-300 px-5 py-3 font-semibold text-white hover:bg-brand-400"
          >
            Join a class
          </Link>
        </Empty>
      ) : (
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-300">
              Today and upcoming
            </h2>

            {todayAndUpcomingSchedules.length ? (
              todayAndUpcomingSchedules.slice(0, 10).map((schedule) => (
                <StudentsScheduleCard key={schedule.id} schedule={schedule} />
              ))
            ) : (
              <p className="rounded-2xl border border-white/60 bg-white/70 p-5 text-brand-300/70">
                No upcoming scheduled sessions.
              </p>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-brand-300">
              Past or closed
            </h2>

            {pastOrClosedSchedules.length ? (
              pastOrClosedSchedules.slice(0, 10).map((schedule) => (
                <StudentsScheduleCard key={schedule.id} schedule={schedule} />
              ))
            ) : (
              <p className="rounded-2xl border border-white/60 bg-white/70 p-5 text-brand-300/70">
                No past, completed, or cancelled sessions.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}