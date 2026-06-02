import type { Schedule } from "../../types/schedule";
import SchedulePanelHeader from "./SchedulePanelHeader";
import ScheduleCard from "./ScheduleCard";
import EmptySchedule from "./EmptySchedule";
import Spinner from "../../components/Spinner";

interface SchedulePanelProps {
  selectedDate: Date;
  schedules: Schedule[];
  isLoading?: boolean;
}

export default function SchedulePanel({
  selectedDate,
  schedules,
  isLoading = false,
}: SchedulePanelProps) {
  return (
    <div
      className="
        rounded-2xl border border-white/10 bg-white/10
        p-3 backdrop-blur-xl
        sm:p-5
        lg:rounded-3xl lg:p-6
      "
    >
      <SchedulePanelHeader
        selectedDate={selectedDate}
        totalSchedules={schedules.length}
      />

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center sm:min-h-72">
          <Spinner />
        </div>
      ) : schedules.length === 0 ? (
        <EmptySchedule />
      ) : (
        <div
          className="
            max-h-112 space-y-3 overflow-y-auto pr-1
            sm:max-h-160 sm:space-y-4 sm:pr-2
            lg:max-h-240
          "
        >
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      )}
    </div>
  );
}