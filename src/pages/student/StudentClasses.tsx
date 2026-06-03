import { useForm } from "react-hook-form";
import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import {
  useJoinClass,
  useStudentClasses,
} from "../../features/student/useStudentClasses";
import { Link } from "react-router-dom";

interface JoinClassForm {
  classCode: string;
}

export default function StudentClasses() {
  const { classes, error, isLoading } = useStudentClasses();
  const { joinClass, isPending } = useJoinClass();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JoinClassForm>();

  function onSubmit(data: JoinClassForm) {
    joinClass(data.classCode, {
      onSuccess: () => reset(),
    });
  }

  if (isLoading) return <Spinner />;
  if (error) return <ErrorMessage message="Classes could not be loaded." />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-4xl font-bold text-brand-300">My Classes</h1>
          <p className="mt-2 text-brand-300/70">
            Join a class using the code from your teacher.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-2 sm:flex-row sm:items-start"
        >
          <div>
            <input
              {...register("classCode", {
                required: "Class code is required",
              })}
              placeholder="Class code"
              className="w-full rounded-xl border border-white/60 bg-white/70 px-4 py-3 text-brand-300 outline-none sm:w-72"
            />
            {errors.classCode && (
              <p className="mt-1 text-sm text-red-700">
                {errors.classCode.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-brand-300 px-5 py-3 font-semibold text-white hover:bg-brand-400 disabled:opacity-60"
          >
            {isPending ? "Joining..." : "Join class"}
          </button>
        </form>
      </div>

      {!classes.length ? (
        <Empty resourceName="classes" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((classItem) => (
            <Link
              key={classItem.class_id}
              to={`/student/classes/${classItem.class_id}`}
              className="block rounded-2xl border border-white/60 bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-video overflow-hidden bg-brand-100">
                <img
                  src={classItem.thumbnail || "/background.png"}
                  alt={classItem.class_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-3 p-5">
                <div>
                  <h2 className="text-2xl font-bold text-brand-300">
                    {classItem.class_name}
                  </h2>
                  <p className="text-sm font-semibold text-brand-200">
                    {classItem.class_code}
                  </p>
                </div>
                <p className="text-brand-300/70">
                  {classItem.description || "No class description."}
                </p>
                <div className="text-sm text-brand-300/70">
                  <p>Teacher: {classItem.teacher_name || "Unknown"}</p>
                  <p>Room: {classItem.room || "Not specified"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
