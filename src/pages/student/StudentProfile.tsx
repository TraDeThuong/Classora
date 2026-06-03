import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";
import { useStudent } from "../../features/student/useStudent";
import { useUpdateStudentProfile } from "../../features/student/useUpdateStudentProfile";

interface StudentProfileForm {
  full_name: string;
  avatar_url: string;
  date_of_birth: string;
}

export default function StudentProfile() {
  const { student, error, isLoading } = useStudent();
  const { updateProfile, isUpdating } = useUpdateStudentProfile();

  const { register, handleSubmit } = useForm<StudentProfileForm>({
    values: {
      full_name: student?.full_name || "",
      avatar_url: student?.avatar_url || "",
      date_of_birth: student?.date_of_birth || "",
    },
  });

  if (isLoading) return <Spinner />;

  if (error || !student) {
    return (
      <ErrorMessage message="Student profile could not be loaded." />
    );
  }

  function onSubmit(data: StudentProfileForm) {
    updateProfile(data);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-brand-300">
            Profile
          </h1>

          <p className="mt-2 text-brand-300/70">
            Manage your student account information.
          </p>
        </div>

        <button
          disabled={isUpdating}
          className="rounded-xl bg-brand-300 px-5 py-3 font-semibold text-white hover:bg-brand-400 disabled:opacity-50"
        >
          {isUpdating ? "Saving..." : "Save changes"}
        </button>
      </div>

      <section className="grid gap-6 rounded-2xl border border-white/60 bg-white/75 p-6 shadow-sm lg:grid-cols-[20rem_1fr]">
        <div className="text-center">
          <img
            src={
              student.avatar_url ||
              "/default_user.png"
            }
            alt={student.full_name}
            className="mx-auto h-40 w-40 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />

          <p className="mt-4 rounded-full bg-green-500/20 px-4 py-2 font-semibold text-green-700">
            {student.status}
          </p>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-semibold uppercase text-brand-200">
              Full name
            </label>

            <input
              {...register("full_name")}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand-300"
            />
          </div>

          {/* <div>
            <label className="mb-1 block text-sm font-semibold uppercase text-brand-200">
              Avatar URL
            </label>

            <input
              {...register("avatar_url")}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand-300"
            />
          </div> */}

          <div>
            <label className="mb-1 block text-sm font-semibold uppercase text-brand-200">
              Email
            </label>

            <input
              value={student.email}
              disabled
              className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold uppercase text-brand-200">
              Date of birth
            </label>

            <input
              type="date"
              {...register("date_of_birth")}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-brand-300"
            />
          </div>
        </div>
      </section>
    </form>
  );
}