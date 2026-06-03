const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface SchedulePanelHeaderProps {
  selectedDate: Date;
  totalSchedules: number;
}

export default function SchedulePanelHeader({
  selectedDate,
  totalSchedules,
}: SchedulePanelHeaderProps) {
  return (
    <div className="mb-6">
      <h3 className="text-[2rem] font-semibold text-white">
        {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()},{" "}
        {selectedDate.getFullYear()}
      </h3>

      <p className="text-[1.3rem] text-white/60">
        {totalSchedules} schedules planned
      </p>
    </div>
  );
}