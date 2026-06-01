import { useClass } from "../features/classes/useClass";
import FullPageLoader from "../components/FullPageLoader";
import AddStudent from "../features/students/AddStudent";
import { useAssignmentsByClass } from "../features/assignments/useAssignmentsByClass";
import AssignmentsList from "../features/assignments/AssignmentsList";
import { useStudentsByClass } from "../features/students/useStudentsByClass";
import StudentTable from "../features/students/StudentTable";
import { useNavigate, useParams } from "react-router-dom";
import { ClassStatus } from "../components/ClassStatus";
import ClassInfoForm from "../features/classes/ClassInfoForm";
import { getClassStatus } from "../utils/getClassStatus";
import { useUpdateClassStatus } from "../features/classes/useUpdateClassStatus";

export default function ClassDetail() {
    const { classId } = useParams();
    const navigate = useNavigate();
    const numericClassId = Number(classId);
    const { classData, isLoading : classLoading } = useClass(Number(classId))
    const { students, isLoading: studentsLoading } =useStudentsByClass(numericClassId);
    const { assignments, isLoading : assignmentsLoading} = useAssignmentsByClass(Number(classId));

    
    const { updateStatus, isUpdatingStatus } = useUpdateClassStatus(numericClassId);

    if (classLoading || assignmentsLoading || studentsLoading) return <FullPageLoader/>

    const displayStatus = getClassStatus(classData);
    return (
        <div>
            <div className = "flex justify-between mb-10 gap-10">

                <div className="flex items-center gap-4">
                <ClassStatus status={displayStatus} />

                {displayStatus === "completed" && (
                    <button
                    disabled={isUpdatingStatus}
                    onClick={() =>
                        updateStatus({
                        id: numericClassId,
                        status: "archived",
                        })
                    }
                    className="rounded-xl border border-amber-400/30 bg-amber-500/20 px-4 py-2 font-semibold text-amber-200 transition hover:bg-amber-500/30 disabled:opacity-60"
                    >
                    Archive Class
                    </button>
                )}

                {displayStatus === "archived" && (
                    <button
                    disabled={isUpdatingStatus}
                    onClick={() =>
                        updateStatus({
                        id: numericClassId,
                        status: "inactive",
                        })
                    }
                    className="rounded-xl border border-emerald-400/30 bg-emerald-500/20 px-4 py-2 font-semibold text-emerald-200 transition hover:bg-emerald-500/30 disabled:opacity-60"
                    >
                    Restore Class
                    </button>
                )}
                </div>

                <div className = "flex gap-10">
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

                    <AddStudent 
                        classId={numericClassId} 
                        currentStudents={students.length}
                        maxStudents={classData.max_students}/>
                </div>
            </div>
            <ClassInfoForm classData={classData} />
            <AssignmentsList assignments={assignments} />
            <StudentTable students={students} classId={numericClassId} />
        </div>
    );
}