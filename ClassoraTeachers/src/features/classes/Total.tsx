import TotalItems from "../../components/TotalItems";

export default function Total() {

    // FAKE 
    const totalClasses = 5
    const activeClasses = 3
    const completedClasses = 2
    const totalStudents = 90


  return (
    <div>
        <div>
            <div className = "flex flex-rows gap-3 justify-evenly mb-20">
                <TotalItems totalname={"Total Classes"} total={totalClasses}/>
                <TotalItems totalname={"Active Classes"} total={activeClasses}/>
                <TotalItems totalname={"Completed Classes"} total={completedClasses}/>
                <TotalItems totalname={"Total Students"} total={totalStudents}/>
            </div>
        </div>
    </div>
  )
}
