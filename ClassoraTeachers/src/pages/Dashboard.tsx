import Button from "../components/Button";
import Calendar from "../features/dashboard/Calender";
import Total from "../features/dashboard/Total";

export default function Dashboard() {

  return (
    <div>
      <div className = "flex flex-row gap-4 justify-end mb-10">
        <div className = "text-brand-50">
          <Button size="large" variation="primary">Create class</Button>
        </div>
        <div className = "text-brand-50">
          <Button size="large" variation="primary">Create Assignment</Button>
        </div>
      </div>

      <Total/>

      <div className = "flex justify-evenly gap-3">
        <Calendar/>
        {/* <RecentStudentActivity/> */}
      </div>
      
    </div>
  )
}

