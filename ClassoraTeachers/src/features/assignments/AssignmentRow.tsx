import { 
    // HiPencil, 
    // HiSquare2Stack, 
    HiTrash } from "react-icons/hi2";
import Menus from "../../components/Menus";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
// import CreateAssignmentsForm from "./CreateAssignmentsForm";
// import { createAssignment } from "../../services/apiAssignments";
import ConfirmDelete from "../../components/ConfirmDelete";
import { useDeleteAssignment } from "./useDeleteAssignment";
import { FaRegEye } from "react-icons/fa";
import AssignmentDetail from "./AssignmentDetail";


interface AssignmentRowProps {
  assignment: {
    id: number;
    title: string;
    type: string;
    due_date: string | null;
    status: string;
    description?: string | null;
    image?: string | null;
    class_id?: number;
    teacher_id?: number;
  };
  classCode: string;
}

export default function AssignmentRow({
  assignment,
  classCode,
}: AssignmentRowProps) {
  const {
    id: assignmentId,
    title,
    type,
    due_date,
    status,
    // description,
    // image,
    // class_id,
    // teacher_id,
  } = assignment;

  const { deleteAssignment, isDeleting } = useDeleteAssignment();

//   async function handleDuplicate() {
//     await createAssignment({
//       title: `Copy of ${title}`,
//       type,
//       due_date,
//       status,
//       description,
//       image,
//       class_id,
//       teacher_id,
//     });
//   }

  const dueDate = due_date
    ? new Date(due_date).toLocaleDateString("vi-VN")
    : "No due date";

  return (
    <Table.Row>
      <div></div>

      <div className="font-semibold text-brand-300">{title}</div>

      <div>{classCode}</div>

      <div className="capitalize text-brand-300">{type}</div>

      <div className="text-brand-300">{dueDate}</div>

      <div>
        <span
          className={`
            rounded-full px-3 py-1 text-sm font-semibold capitalize
            ${
              status === "published"
                ? "bg-green-500/20 text-green-300"
                : status === "draft"
                ? "bg-yellow-500/20 text-yellow-300"
                : "bg-red-500/20 text-red-300"
            }
          `}
        >
          {status}
        </span>
      </div>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={String(assignmentId)} />

            <Menus.List id={String(assignmentId)}>
              {/* <Menus.Button
                icon={<HiSquare2Stack />}
                onClick={handleDuplicate}
              >
                Duplicate
              </Menus.Button> */}

              {/* <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open> */}

                <Modal.Open opens="delete">
                    <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>

                <Modal.Open opens="seeDetail">
                    <Menus.Button icon={<FaRegEye />}> See Detail</Menus.Button>
                </Modal.Open>
            </Menus.List>

            {/* <Modal.Window name="edit">
              <CreateAssignmentsForm assignmentToEdit={assignment} />
            </Modal.Window> */}

            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="assignments"
                disabled={isDeleting}
                onConfirm={() => deleteAssignment(assignmentId)}
              />
            </Modal.Window>

            <Modal.Window name="seeDetail">
              <AssignmentDetail assignmentId={assignmentId}/>
            </Modal.Window>

          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}