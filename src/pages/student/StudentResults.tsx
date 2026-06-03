import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import StudentAssignmentStatusBadge from "../../features/student/StudentAssignmentStatusBadge";
import { useStudentResults } from "../../features/student/useStudentAssignments";

export default function StudentResults() {
  const { results, error, isLoading } = useStudentResults();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message="Results could not be loaded." />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-brand-300">My Results</h1>
        <p className="mt-2 text-brand-300/70">
          Review your submitted assignments, scores, and feedback.
        </p>
      </div>

      {!results.length ? (
        <Empty resourceName="submitted assignments" />
      ) : (
        <div className="space-y-4">
          {results.map((assignment) => (
            <article
              key={assignment.id}
              className="rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm"
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
                  <p className="text-sm font-semibold text-brand-200">
                    {assignment.class_name}
                  </p>
                  {assignment.feedback && (
                    <p className="mt-3 rounded-xl bg-brand-300/10 p-3 text-brand-300">
                      Feedback: {assignment.feedback}
                    </p>
                  )}
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <p className="text-2xl font-bold text-brand-300">
                    {assignment.score ?? "-"} / {assignment.total_score}
                  </p>
                  <p className="text-sm text-brand-300/70">
                    {assignment.submitted_at
                      ? new Date(assignment.submitted_at).toLocaleString("vi-VN")
                      : "Not submitted"}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
