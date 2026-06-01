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
    <div className="min-h-160 w-full rounded-4xl border border-white/10 bg-gradient-brand-200 p-8 shadow-xl shadow-black/10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-[2.4rem] font-bold text-white">Calendar</h2>
          <p className="text-[1.4rem] text-white/70">
            Manage your teaching schedules
          </p>
        </div>

        <AddNewSchedule selectedDate={selectedDate} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/20"
            >
              ←
            </button>

            <h3 className="text-[2rem] font-semibold text-white">
              {monthNames[currentMonth]} {currentYear}
            </h3>

            <button
              onClick={handleNextMonth}
              className="rounded-xl bg-white/10 px-4 py-2 text-white hover:bg-white/20"
            >
              →
            </button>
          </div>

          <div className="mb-4 grid grid-cols-7 gap-2">
            {weekdays.map((day) => (
              <div
                key={day}
                className="py-3 text-center text-[1.3rem] font-semibold text-white/60"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
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
                  className="aspect-square rounded-2xl bg-white/2"
                />
              ),
            )}
          </div>
        </div>

        <SchedulePanel   
          selectedDate={selectedDate}
          schedules={schedulesByDate}
          isLoading={isLoadingSchedulesByDate} />
      </div>
    </div>
  );
}