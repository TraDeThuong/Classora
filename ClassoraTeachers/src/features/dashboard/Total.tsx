import TotalItems from "../../components/TotalItems";

export default function Total() {

      //Fake 
  const totalClasses = 5
  const totalStudents = 200
  const totalAssignments = 40
  
  return (
    <div>
      <div className = "flex flex-rows gap-3 justify-evenly mb-20">
        <TotalItems totalname={"Total Class"} total={totalClasses}/>
        <TotalItems totalname={"Total Students"} total={totalStudents}/>
        <TotalItems totalname={"Total Assignments"} total={totalAssignments}/>
        </div>
    </div>
  )
}
