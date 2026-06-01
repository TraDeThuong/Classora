import { useParams } from "react-router-dom";
import { useClass } from "../features/classes/useClass";
import FullPageLoader from "../components/FullPageLoader";
import AddStudent from "../features/students/AddStudent";
import { useAssignmentsByClass } from "../features/assignments/useAssignmentsByClass";
import AssignmentsList from "../features/assignments/AssignmentsList";
import { useStudentsByClass } from "../features/students/useStudentsByClass";
import StudentTable from "../features/students/StudentTable";

export default function ClassDetail() {
    const { classId } = useParams();
    const numericClassId = Number(classId);
    const { classData, isLoading : classLoading } = useClass(Number(classId))
    const { students, isLoading: studentsLoading } =useStudentsByClass(numericClassId);
    const { assignments, isLoading : assignmentsLoading} = useAssignmentsByClass(Number(classId));

    if (classLoading || assignmentsLoading || studentsLoading) return <FullPageLoader/>

    return (
        <div>
            <div className = "flex justify-end mb-10">
                <AddStudent classId={numericClassId} />
            </div>

            <AssignmentsList assignments={assignments} />
            <StudentTable students={students} classId={numericClassId} />

            {/* <div>
                <h1>{classData.class_name}</h1>
                <p>{classData.class_code}</p>
            </div> */}
        </div>
    );
}