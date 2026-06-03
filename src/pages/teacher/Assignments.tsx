import AddAssignments from "../../features/assignments/AddAssignments"
import AssignmentTableOperations from "../../features/assignments/AssignmentTableOperations";
import AssignmentTable from "../../features/assignments/AssignmentTable";

export default function Assignments() {
  return (
    <div>
      <div className = "text-brand-50 flex justify-end">
        <AddAssignments/>
      </div>

      <AssignmentTableOperations/>
      <AssignmentTable/>
    </div>
  )
}
