import AddClass from "../../features/classes/AddClass";
import Calendar from "../../features/dashboard/Calender";
import Total from "../../features/dashboard/Total";
import AddAssignments from "../../features/assignments/AddAssignments";
import RecentStudentActivity from "../../features/dashboard/RecentStudentActivity";

export default function Dashboard() {
  return (
    <div className="w-full">
      <div className=" mb-6 flex flex-row justify-center gap-3  sm:flex-row sm:justify-end lg:mb-10 ">
        <AddClass />
        <AddAssignments />
      </div>

      <Total />

      <div
        className="
          mt-6 flex flex-col gap-6
          lg:mt-10 xl:grid xl:grid-cols-[minmax(0,1fr)_42rem] xl:items-start
        "
      >
        <div className="w-full">
          <Calendar />
        </div>

        <div className="w-full">
          <RecentStudentActivity />
        </div>
      </div>
    </div>
  );
}
