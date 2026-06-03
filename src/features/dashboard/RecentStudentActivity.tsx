import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import { useTeacherStudentActivity } from "./useTeacherStudentActivity";
import { ActivityItem } from "./ActivityItem";




export default function RecentStudentActivity() {
  const { activities, error, isLoading } = useTeacherStudentActivity();

  return (
    <section className="min-h-160 w-full rounded-3xl border border-white/60 bg-white/70 p-5 shadow-xl shadow-black/5 lg:min-h-256 lg:rounded-4xl lg:p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-brand-300">
          Recent Student Activity
        </h2>
        <p className="mt-1 text-sm text-brand-300/70">
          Latest class joins and assignment submissions.
        </p>
      </div>

      {isLoading && (
        <div className="flex min-h-80 items-center justify-center">
          <Spinner />
        </div>
      )}

      {error && <ErrorMessage message="Student activity could not be loaded." />}

      {!isLoading && !error && !activities.length && (
        <Empty resourceName="student activity" />
      )}

      {!isLoading && !error && !!activities.length && (
        <div className="max-h-[550px] space-y-3 overflow-y-auto pr-2">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </section>
  );
}
