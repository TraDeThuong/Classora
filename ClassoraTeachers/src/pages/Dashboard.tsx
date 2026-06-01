import AddClass from "../features/classes/AddClass";
import Calendar from "../features/dashboard/Calender";
import Total from "../features/dashboard/Total";
import AddAssignments from "../features/assignments/AddAssignments"


export default function Dashboard() {

  return (
    <div>
      < div className = "flex flex-row gap-4 justify-end mb-10">
          <AddClass />
          <AddAssignments/>
      </div>

      <Total/>

      <div className = "flex justify-evenly gap-3">
        <Calendar/>
        {/* <RecentStudentActivity/> */}
      </div>
      
    </div>
  )
}

