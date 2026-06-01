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
    <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
      <SchedulePanelHeader
        selectedDate={selectedDate}
        totalSchedules={schedules.length}
      />

      {isLoading ? (
        <div className="flex min-h-75 items-center justify-center">
          <Spinner />
        </div>
      ) : schedules.length === 0 ? (
        <EmptySchedule />
      ) : (
        <div className="max-h-240 space-y-4 overflow-y-auto pr-2">
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
            />
          ))}
        </div>
      )}
    </div>
  );
}