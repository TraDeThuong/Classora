import { useClass } from "../features/classes/useClass";
import FullPageLoader from "../components/FullPageLoader";
import AddStudent from "../features/students/AddStudent";
import { useAssignmentsByClass } from "../features/assignments/useAssignmentsByClass";
import AssignmentsList from "../features/assignments/AssignmentsList";
import { useStudentsByClass } from "../features/students/useStudentsByClass";
import StudentTable from "../features/students/StudentTable";
import { useNavigate, useParams } from "react-router-dom";

export default function ClassDetail() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const numericClassId = Number(classId);
    const { classData, isLoading : classLoading } = useClass(Number(classId))
    const { students, isLoading: studentsLoading } =useStudentsByClass(numericClassId);
    const { assignments, isLoading : assignmentsLoading} = useAssignmentsByClass(Number(classId));

    if (classLoading || assignmentsLoading || studentsLoading) return <FullPageLoader/>

    return (
        <div>
            <div className = "flex justify-end mb-10 gap-10">

                <button
                    onClick={() => navigate("/classes")}
                    className="
                        rounded-xl border border-white/20
                        bg-white/10 px-4 py-2
                        text-white transition-all
                        hover:bg-white/20
                    "
                >
                    ← Back to Classes
                </button>

                <AddStudent classId={numericClassId} />
            </div>

            <AssignmentsList assignments={assignments} />
            <StudentTable students={students} classId={numericClassId} />
        </div>
    );
}