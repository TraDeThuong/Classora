import { useForm } from "react-hook-form";
import type { Class } from "../../types/classes";
import { useUpdateClass } from "./useUpdateClass";
import { ClassStatus } from "../../components/ClassStatus";
import { getClassStatus } from "../../utils/getClassStatus";

interface ClassInfoFormProps {
  classData: Class;
}

type ClassFormValues = {
  class_name: string;
  description: string | null;
  max_students: number;
  room: string | null;
  start_date: string;
  end_date: string;
};

export default function ClassInfoForm({ classData }: ClassInfoFormProps) {
  const { updateClassInfo, isUpdating } = useUpdateClass(classData.id);
  const displayStatus = getClassStatus(classData);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ClassFormValues>({
    defaultValues: {
      class_name: classData.class_name,
      description: classData.description,
      max_students: classData.max_students,
      room: classData.room,
      start_date: classData.start_date,
      end_date: classData.end_date,
    },
  });

  function onSubmit(data: ClassFormValues) {
    const newClassData = {
      ...data,
      max_students: Number(data.max_students),
    };

    updateClassInfo(
      {
        id: classData.id,
        newClassData,
      },
      {
        onSuccess: () => {
          reset(newClassData);
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-10 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <input
            {...register("class_name", {
              required: "Class name is required",
            })}
            className="w-full bg-transparent text-4xl font-bold text-white outline-none"
          />

          <p className="mt-2 text-xl font-semibold text-brand-200">
            {classData.class_code}
          </p>
        </div>

        <ClassStatus status={displayStatus} />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-white/60">
            Max students
          </label>
          <input
            type="number"
            {...register("max_students", {
              required: true,
              min: 1,
            })}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-white/60">
            Room / Online link
          </label>
          <input
            {...register("room")}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-white/60">
            Start date
          </label>
          <input
            type="date"
            {...register("start_date")}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-white/60">
            End date
          </label>
          <input
            type="date"
            {...register("end_date")}
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold text-white/60">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white outline-none"
        />
      </div>

      {isDirty && (
        <div className="mt-6 flex justify-end">
          <button
            disabled={isUpdating}
            className="rounded-xl bg-brand-200 px-6 py-3 font-bold text-brand-900 transition-all hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdating ? "Updating..." : "Update Class"}
          </button>
        </div>
      )}
    </form>
  );
}