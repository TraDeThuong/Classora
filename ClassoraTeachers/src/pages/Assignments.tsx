import { useEffect } from "react";
import { getAssignments } from "../services/apiAssignments";
import AddAssignments from "../features/assignments/AddAssignments"
import AssignmentTableOperations from "../features/assignments/AssignmentTableOperations";
import AssignmentTable from "../features/assignments/AssignmentTable";

export default function Assignments() {

    useEffect(() => {
      getAssignments().then((data) => console.log(data));
    }, []);

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
