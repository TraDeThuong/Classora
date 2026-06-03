import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import { useStudentAssignments } from "../../features/student/useStudentAssignments";
import { useStudentClasses } from "../../features/student/useStudentClasses";
import { useStudentSchedules } from "../../features/student/useStudentSchedules";
import type { StudentSchedule } from "../../types/schedule";


function normalizeTime(time: string) {
  return time.replace("+00", "").slice(0, 8);
}

function getScheduleDateTime(schedule: StudentSchedule) {
  const date = schedule.teaching_date.split("T")[0];
  const time = normalizeTime(schedule.start_time);

  return new Date(`${date}T${time}`);
}

function formatScheduleDate(schedule: StudentSchedule) {
  return getScheduleDateTime(schedule).toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

function formatTime(time: string) {
  return time.slice(0, 5);
}



export default function StudentDashboard() {
  const {
    classes,
    error: classesError,
    isLoading: isLoadingClasses,
  } = useStudentClasses();
  const {
    assignments,
    error: assignmentsError,
    isLoading: isLoadingAssignments,
  } = useStudentAssignments();
  const {
    schedules,
    error: schedulesError,
    isLoading: isLoadingSchedules,
  } = useStudentSchedules();

  if (isLoadingClasses || isLoadingAssignments) {
    return <Spinner />;
  }

  if (classesError || assignmentsError) {
    return <ErrorMessage message="Student dashboard could not be loaded." />;
  }

  const upcomingSchedules = schedules.filter((schedule) => {
    const scheduleDate = getScheduleDateTime(schedule);

    return (
      schedule.status === "scheduled" &&
      scheduleDate >= new Date()
    );
  });
  const upcomingSchedulePreview = upcomingSchedules.slice(0, 3);
  const openAssignments = assignments.filter(
    (assignment) => assignment.student_status === "not_started",
  ).length;
  const submittedAssignments = assignments.filter((assignment) =>
    ["submitted", "late", "graded"].includes(assignment.student_status),
  ).length;
  const overdueAssignments = assignments.filter(
    (assignment) => assignment.student_status === "closed",
  ).length;

  const stats = [
    { label: "Classes", value: classes.length },
    { label: "Open assignments", value: openAssignments },
    { label: "Submitted", value: submittedAssignments },
    { label: "Closed", value: overdueAssignments },
    { label: "Upcoming sessions", value: upcomingSchedules.length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-brand-300">Dashboard</h1>
        <p className="mt-2 text-brand-300/70">
          Track your classes, assignments, and results.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
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

      <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-2xl font-bold text-brand-300">
            Upcoming schedule
          </h2>
          <Link
            to="/student/schedules"
            className="text-sm font-semibold text-brand-200 hover:text-brand-300"
          >
            View all
          </Link>
        </div>

        <div className="space-y-3">
          {isLoadingSchedules && <Spinner size="sm" />}

          {schedulesError && (
            <ErrorMessage message="Upcoming schedule could not be loaded." />
          )}

          {!isLoadingSchedules &&
            !schedulesError &&
            upcomingSchedulePreview.map((schedule) => (
              <Link
                key={schedule.id}
                to="/student/schedules"
                className="flex flex-col justify-between gap-3 rounded-xl bg-white/70 p-4 transition hover:bg-white sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-semibold text-brand-300">
                    {schedule.title}
                  </p>
                  <p className="text-sm text-brand-300/60">
                    {schedule.class_code} - {schedule.class_name}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-sm font-semibold text-brand-200">
                    {formatScheduleDate(schedule)}
                  </p>
                  <p className="text-sm text-brand-300/70">
                    {formatTime(schedule.start_time)} -{" "}
                    {formatTime(schedule.end_time)}
                  </p>
                </div>
              </Link>
            ))}

          {!isLoadingSchedules &&
            !schedulesError &&
            !upcomingSchedules.length && (
              <p className="text-brand-300/70">No upcoming schedule yet.</p>
            )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/70 p-5 shadow-sm">
        <h2 className="mb-4 text-2xl font-bold text-brand-300">
          Upcoming assignments
        </h2>

        <div className="space-y-3">
          {assignments.slice(0, 5).map((assignment) => (
            <Link
              key={assignment.id}
              to={`/student/assignments/${assignment.id}`}
              className="
                flex flex-col justify-between gap-2
                rounded-xl bg-white/70 p-4
                transition hover:bg-white hover:shadow-sm
                sm:flex-row sm:items-center
              "
            >
              <div>
                <p className="font-semibold text-brand-300">
                  {assignment.title}
                </p>

                <p className="text-sm text-brand-300/60">
                  {assignment.class_name}
                </p>
              </div>

              <p className="text-sm font-semibold text-brand-200">
                {assignment.due_date
                  ? new Date(assignment.due_date).toLocaleString("vi-VN")
                  : "No due date"}
              </p>
            </Link>
          ))}

          {!assignments.length && (
            <p className="text-brand-300/70">No assignments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
