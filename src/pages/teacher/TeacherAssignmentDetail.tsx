import { useNavigate, useParams } from "react-router-dom";
import Empty from "../../components/Empty";
import AssignmentDetail from "../../features/assignments/AssignmentDetail";

export default function TeacherAssignmentDetail() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const numericAssignmentId = Number(assignmentId);

  if (!assignmentId || Number.isNaN(numericAssignmentId)) {
    return <Empty resourceName="assignment" />;
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate("/teacher/assignments")}
        className="rounded-xl border border-white/20 bg-white/20 px-4 py-2 font-semibold text-white transition hover:bg-white/30"
      >
        Back to assignments
      </button>

      <AssignmentDetail assignmentId={numericAssignmentId} isPageView />
    </div>
  );
}
