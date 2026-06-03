import { HiTrash } from "react-icons/hi2";
import Menus from "../../components/Menus";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import supabase from "../../services/supabase";
import { useDeleteClassStudent } from "./useDeleteClassStudent";
import ConfirmDelete from "../../components/ConfirmDelete";
import type { ClassStudent, StudentStatus } from "../../types/students";

interface StudentRowProps {
  student: ClassStudent;
  classId: number;
}

const fakeAvatars = Array.from({ length: 10 }, (_, i) => `avatar_${i + 1}.png`);

function getRandomAvatar(studentId: number) {
  const fileName = fakeAvatars[studentId % fakeAvatars.length];
  return supabase.storage.from("fakeStudentAvatar").getPublicUrl(fileName).data.publicUrl;
}

const statusConfig: Record<StudentStatus, { label: string; className: string; dot: string }> = {
  active:    { label: "Active",    className: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-400" },
  inactive:  { label: "Inactive",  className: "bg-gray-100 text-gray-500",     dot: "bg-gray-400"    },
  graduated: { label: "Graduated", className: "bg-blue-50 text-blue-700",      dot: "bg-blue-400"    },
  banned:    { label: "Banned",    className: "bg-red-50 text-red-600",         dot: "bg-red-400"     },
};

export default function StudentRow({ student, classId }: StudentRowProps) {
    const studentData = student.students;
    const { removeStudent, isDeleting } = useDeleteClassStudent(classId);

  if (!studentData) return null;

  const classStudentId = student.id;

  const avatar = studentData.avatar_url || getRandomAvatar(studentData.id);
  const status = statusConfig[student.status as StudentStatus] ?? statusConfig.inactive;

return (
  <Table.Row>
    <div>
      <img
        src={avatar}
        alt={studentData.full_name}
        className="
          h-9 w-9 rounded-full object-cover ring-2 ring-white
          sm:h-10 sm:w-10
        "
      />
    </div>

    <div className="text-sm font-semibold text-gray-800 sm:text-2xl">
      {studentData.full_name}
    </div>

    <div className="text-sm text-gray-500 sm:text-2xl">
      {studentData.email}
    </div>

    <div>
      <span
        className={`
          inline-flex items-center gap-1 rounded-full
          px-2.5 py-1 text-xs font-semibold
          sm:gap-1.5 sm:px-3 sm:text-2xl
          ${status.className}
        `}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </span>
    </div>

    <div>
      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={String(classStudentId)} />

          <Menus.List id={String(classStudentId)}>
            <Modal.Open opens="delete-student">
              <Menus.Button icon={<HiTrash />}>Remove</Menus.Button>
            </Modal.Open>
          </Menus.List>

          <Modal.Window name="delete-student">
            <ConfirmDelete
              resourceName="student from this class"
              disabled={isDeleting}
              onConfirm={() => removeStudent(classStudentId)}
            />
          </Modal.Window>
        </Menus.Menu>
      </Modal>
    </div>
  </Table.Row>
);
}
