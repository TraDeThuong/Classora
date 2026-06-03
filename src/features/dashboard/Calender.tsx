import { useState } from "react";
import CalendarDay from "./CalenderDay";
import SchedulePanel from "../schedules/SchedulePanel";
import AddNewSchedule from "../schedules/AddNewSchedule";
import { useSchedules } from "../schedules/useSchedules";
import FullPageLoader from "../../components/FullPageLoader";
import { useSchedulesByDate } from "../schedules/useSchedulesByDate";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {

  function formatDate(date: Date) {
    return date.toLocaleDateString("en-CA");
  }
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());


    const { schedules = [] , isLoading : schedulesLoading} = useSchedules();
    const selectedDateString = formatDate(selectedDate);
    const { schedules: schedulesByDate =[] , isLoading: isLoadingSchedulesByDate } = useSchedulesByDate(selectedDateString)

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstDayOfMonth + 1;

    if (dayNumber < 1 || dayNumber > daysInMonth) return null;

    return new Date(currentYear, currentMonth, dayNumber);
  });

  if (schedulesLoading) return <FullPageLoader/>


  function handlePrevMonth() {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  }

  function handleNextMonth() {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  }

  function isSameDate(date1: Date, date2: Date) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  function hasSchedule(date: Date) {
    return schedules.some(
      (schedule) => schedule.teaching_date === formatDate(date),
    );
  }

  function handleSelectDate(date: Date) {
  setSelectedDate(date);
}

return (
  <div
    className="
      min-h-160 w-full rounded-3xl border border-white/10
      bg-gradient-brand-200 p-4 shadow-xl shadow-black/10
      sm:p-6 lg:min-h-256 lg:rounded-4xl lg:p-8
    "
  >
    <div
      className="
        mb-8 flex gap-4 flex-row items-center justify-between
      "
    >
      <div>
        <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-[2.4rem]">
          Calendar
        </h2>

        <p className="text-sm text-white/70 sm:text-base lg:text-[1.4rem]">
          Manage your teaching schedules
        </p>
      </div>

      <div className="w-full sm:w-auto">
        <AddNewSchedule selectedDate={selectedDate} />
      </div>
    </div>

    <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl sm:p-5 lg:rounded-3xl lg:p-6">
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-6">
          <button
            onClick={handlePrevMonth}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 sm:px-4 sm:text-base"
          >
            ←
          </button>

          <h3 className="text-center text-lg font-semibold text-white sm:text-2xl lg:text-[2rem]">
            {monthNames[currentMonth]} {currentYear}
          </h3>

          <button
            onClick={handleNextMonth}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 sm:px-4 sm:text-base"
          >
            →
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 sm:mb-4 sm:gap-2">
          {weekdays.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-semibold text-white/60 sm:py-3 sm:text-sm lg:text-[1.3rem]"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {calendarDays.map((date, index) =>
            date ? (
              <CalendarDay
                key={index}
                date={date}
                isSelected={isSameDate(date, selectedDate)}
                isToday={isSameDate(date, new Date())}
                hasSchedule={hasSchedule(date)}
                onClick={() => handleSelectDate(date)}
              />
            ) : (
              <div
                key={index}
                className="aspect-square rounded-lg bg-white/2 sm:rounded-2xl"
              />
            ),
          )}
        </div>
      </div>

      <div className="w-full">
        <SchedulePanel
          selectedDate={selectedDate}
          schedules={schedulesByDate}
          isLoading={isLoadingSchedulesByDate}
        />
      </div>
    </div>
  </div>
);
}