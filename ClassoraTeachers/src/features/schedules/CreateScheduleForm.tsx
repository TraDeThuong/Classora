import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useClasses } from "../classes/useClasses";
import { useCreateSchedule } from "./useCreateSchedule";
import { MiniSpinner } from "../../components/MiniSpinner";
import { useSchedulesByDate } from "./useSchedulesByDate";

interface ScheduleFormProps {
  selectedDate: Date;
  onCloseModal?: () => void;
}

interface ScheduleFormData {
  class_id: string;
  title: string;
  teaching_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  note?: string;
}

export default function CreateScheduleForm({
  selectedDate,
   onCloseModal,
}: ScheduleFormProps) {
  const { classes = [], isLoading } = useClasses();
  const [selectedClassId, setSelectedClassId] = useState("");
  const { createScheduleMutate, isCreating } = useCreateSchedule();

  const formattedDate = selectedDate.toISOString().split("T")[0];

  const {
    register,
    handleSubmit, watch, trigger,
    formState: { errors },
  } = useForm<ScheduleFormData>({
    defaultValues: {
      teaching_date: formattedDate,
      status: "scheduled",
    } as any,
  });

    const startTime = watch("start_time");
    const endTime = watch("end_time");
    const teachingDate = watch("teaching_date");
    const { schedules: schedulesByDate = [] , isLoading: isLoadingSchedules} = useSchedulesByDate(teachingDate);

  const selectedClass = classes.find(
    (classItem) => String(classItem.id) === selectedClassId,
  );

    function onSubmit(data: ScheduleFormData) {
    const finalLocation =
        data.location?.trim() || selectedClass?.room || "";

    createScheduleMutate(
        {
        class_id: Number(data.class_id),
        title: data.title,
        note: data.note || "",
        teaching_date: data.teaching_date,
        start_time: data.start_time,
        end_time: data.end_time,
        location: finalLocation,
        status: "scheduled",
        },
        {
        onSuccess: () => {
            onCloseModal?.();
        },
        },
    );
    }

  function timeToMinutes(time: string) {
    const [hours, minutes] = time.slice(0, 5).split(":").map(Number);
    return hours * 60 + minutes;
}

    function isTimeOverlap(
        newStart: string,
        newEnd: string,
        oldStart: string,
        oldEnd: string,
        ) {
        const newStartMinutes = timeToMinutes(newStart);
        const newEndMinutes = timeToMinutes(newEnd);
        const oldStartMinutes = timeToMinutes(oldStart);
        const oldEndMinutes = timeToMinutes(oldEnd);

        return newStartMinutes < oldEndMinutes && newEndMinutes > oldStartMinutes;
    }

    useEffect(() => {
    console.log("trigger end_time");
    
    if (startTime && endTime && teachingDate) {
        trigger("end_time");
    }
    }, [startTime, teachingDate, schedulesByDate]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl"
    >
      <div className="mb-6">
        <h3 className="text-[2rem] font-bold text-white">New Schedule</h3>
        <p className="text-[1.3rem] text-white/60">
          Create a teaching schedule for selected day
        </p>
      </div>

      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
            Class
          </label>

          <select
            disabled={isLoading}
            {...register("class_id", {
              required: "Class is required",
              onChange: (e) => setSelectedClassId(e.target.value),
            })}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none"
          >
            <option value="">Select class</option>

            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.class_code} - {classItem.class_name}
              </option>
            ))}
          </select>

          {errors.class_id && (
            <p className="mt-2 text-[1.2rem] text-red-300">
              {errors.class_id.message}
            </p>
          )}

          {selectedClass?.room && (
            <p className="mt-2 text-[1.2rem] text-white/50">
              Default room: {selectedClass.room}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
            Title
          </label>

          <input
            type="text"
            placeholder="React Fundamentals"
            {...register("title", {
              required: "Title is required",
            })}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none placeholder:text-white/40"
          />

          {errors.title && (
            <p className="mt-2 text-[1.2rem] text-red-300">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
            <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
                Teaching date
            </label>

            <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            {...register("teaching_date", {
                required: "Teaching date is required",

                validate: (value) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const selectedDate = new Date(value);
                selectedDate.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                    return "Teaching date cannot be earlier than today";
                }

                return true;
                },
            })}
            />

          {errors.teaching_date && (
            <p className="mt-2 text-[1.2rem] text-red-300">
              {errors.teaching_date.message}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
              Start time
            </label>

            <input
              type="time"
              {...register("start_time", {
                required: "Start time is required",
              })}
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none"
            />

            {errors.start_time && (
              <p className="mt-2 text-[1.2rem] text-red-300">
                {errors.start_time.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
              End time
            </label>

            <input
                type="time"
                disabled={!startTime}
                min={startTime || undefined}
                {...register("end_time", {
                    required: "End time is required",

                validate: (endTime) => {
                if (isLoadingSchedules) {
                    return "Checking existing schedules. Please wait...";
                }

                if (!startTime) return "Please select start time first";

                const startMinutes = timeToMinutes(startTime);
                const endMinutes = timeToMinutes(endTime);

                if (endMinutes <= startMinutes) {
                    return "End time must be after start time";
                }

                if (endMinutes - startMinutes > 300) {
                    return "Teaching time is too long. Maximum is 5 hours.";
                }

                const isOverlapped = schedulesByDate.some((schedule) =>
                    isTimeOverlap(
                    startTime,
                    endTime,
                    schedule.start_time,
                    schedule.end_time,
                    ),
                );

                if (isOverlapped) {
                    return "This time overlaps with an existing schedule. Please choose another time.";
                }

                return true;
                }
                })}
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none"
            />

            {errors.end_time && (
              <p className="mt-2 text-[1.2rem] text-red-300">
                {errors.end_time.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
            Location
          </label>

          <input
            type="text"
            placeholder="Leave empty to use class room"
            {...register("location")}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none placeholder:text-white/40"
          />

          <p className="mt-2 text-[1.2rem] text-white/50">
            If empty, system will use the selected class room.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
            Note
          </label>

          <textarea
            rows={4}
            placeholder="Add schedule note..."
            {...register("note")}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCloseModal}
          className="rounded-2xl bg-white/10 px-5 py-3 text-[1.4rem] font-medium text-white hover:bg-white/20"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isCreating || isLoadingSchedules}
          className="rounded-2xl bg-gradient-brand-100 px-5 py-3 text-[1.4rem] font-bold text-black hover:bg-green-300"
        >
            {isCreating && <MiniSpinner />}
            {isCreating ? "Creating..." : "Create Schedule"}
        </button>
      </div>
    </form>
  );
}