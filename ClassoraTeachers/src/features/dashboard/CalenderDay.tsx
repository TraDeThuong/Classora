interface CalendarDayProps {
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  hasSchedule?: boolean;
  onClick: () => void;
}

export default function CalendarDay({
  date,
  isSelected,
  isToday,
  hasSchedule = false,
  onClick,
}: CalendarDayProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative aspect-square rounded-2xl border text-[1.4rem]
        transition-all duration-300 hover:scale-105
        ${
          isSelected
            ? "border-white/40 bg-white/25 text-white"
            : "border-white/10 bg-white/5 text-white hover:bg-white/15"
        }
        ${isToday ? "ring-2 ring-brand-300" : ""}
      `}
    >
      {date.getDate()}

      {isToday && (
        <span className="absolute bottom-1 right-1 text-[0.8rem] font-semibold text-brand-300">
          Today
        </span>
      )}

      {hasSchedule && (
        <span className="absolute bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-brand-100" />
      )}
    </button>
  );
}