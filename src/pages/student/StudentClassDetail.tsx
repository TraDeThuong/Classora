import { Link, useParams } from "react-router-dom";
import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import { StudentsScheduleCard } from "../../features/schedules/StudentScheduleCard";
import { useStudentAssignments } from "../../features/student/useStudentAssignments";
import { useStudentClasses } from "../../features/student/useStudentClasses";
import { useStudentSchedules } from "../../features/student/useStudentSchedules";
import StudentClassAssignmentCard from "../../features/student/StudentClassAssignmentCard";

export default function StudentClassDetail() {
  const { classId } = useParams();

  const numericClassId = Number(classId);

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

  if (isLoadingClasses || isLoadingAssignments || isLoadingSchedules) {
    return <Spinner />;
  }

  if (classesError || assignmentsError || schedulesError) {
    return <ErrorMessage message="Class detail could not be loaded." />;
  }

  const classItem = classes.find(
    (item) => item.class_id === numericClassId,
  );

  if (!classItem) {
    return <Empty resourceName="class detail" />;
  }

  const classAssignments = assignments.filter(
    (assignment) => assignment.class_id === numericClassId,
  );

  const classSchedules = schedules.filter(
    (schedule) => schedule.class_id === numericClassId,
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/60 bg-white/75 p-6 shadow-sm">
        <Link
          to="/student/classes"
          className="text-sm font-semibold text-brand-200 hover:text-brand-300"
        >
          ← Back to classes
        </Link>

        <h1 className="mt-4 text-4xl font-bold text-brand-300">
          {classItem.class_name}
        </h1>

        <p className="mt-2 text-brand-300/70">
          {classItem.description || "No description."}
        </p>

        <div className="mt-4 grid gap-3 text-sm text-brand-300/70 sm:grid-cols-2 lg:grid-cols-4">
          <p>
            <span className="font-semibold text-brand-300">Code:</span>{" "}
            {classItem.class_code}
          </p>
          <p>
            <span className="font-semibold text-brand-300">Teacher:</span>{" "}
            {classItem.teacher_name || "Unknown"}
          </p>
          <p>
            <span className="font-semibold text-brand-300">Room:</span>{" "}
            {classItem.room || "Not specified"}
          </p>
          <p>
            <span className="font-semibold text-brand-300">Status:</span>{" "}
            {classItem.class_status}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-300">Assignments</h2>

        {classAssignments.length ? (
          <div className="grid gap-4">
            {classAssignments.map((assignment) => (
                <StudentClassAssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/60 bg-white/70 p-5 text-brand-300/70">
            No assignments in this class yet.
          </p>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-brand-300">Schedules</h2>

        {classSchedules.length ? (
          classSchedules.map((schedule) => (
            <StudentsScheduleCard key={schedule.id} schedule={schedule} />
          ))
        ) : (
          <p className="rounded-2xl border border-white/60 bg-white/70 p-5 text-brand-300/70">
            No schedules in this class yet.
          </p>
        )}
      </section>
    </div>
  );
}