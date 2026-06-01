interface ClassOption {
  id: number;
  class_code: string;
  class_name: string;
  room?: string | null;
}

interface ScheduleFormProps {
  selectedDate: Date;
  classes: ClassOption[];
  onClose?: () => void;
}

export default function ScheduleForm({
  selectedDate,
  classes,
  onClose,
}: ScheduleFormProps) {
  const formattedDate = selectedDate.toISOString().split("T")[0];

  return (
    <form className="w-full rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
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

          <select className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none">
            <option value="">Select class</option>

            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.class_code} - {classItem.class_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
            Title
          </label>

          <input
            type="text"
            placeholder="React Fundamentals"
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none placeholder:text-white/40"
          />
        </div>

        <div>
          <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
            Teaching date
          </label>

          <input
            type="date"
            defaultValue={formattedDate}
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
              Start time
            </label>

            <input
              type="time"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
              End time
            </label>

            <input
              type="time"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[1.3rem] font-medium text-white/80">
            Location
          </label>

          <input
            type="text"
            placeholder="Leave empty to use class room"
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
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-[1.4rem] text-white outline-none placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-white/10 px-5 py-3 text-[1.4rem] font-medium text-white hover:bg-white/20"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-2xl bg-green-400 px-5 py-3 text-[1.4rem] font-bold text-black hover:bg-green-300"
        >
          Create Schedule
        </button>
      </div>
    </form>
  );
}