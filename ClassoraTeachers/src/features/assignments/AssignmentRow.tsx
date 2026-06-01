import { 
  HiPencil,
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
import CreateAssignmentsForm from "./CreateAssignmentsForm";
import ConfirmStatusAction from "../../components/ConfirmStatusAction";
import { useUpdateAssignmentStatus } from "./useUpdateAssignmentStatus";
import { RiDraftLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { PiArchiveDuotone } from "react-icons/pi";


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
  const {updateStatus} = useUpdateAssignmentStatus ()

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

  function handlePublish () {
    updateStatus ({
      id:assignment.id,
      status:"published"
    })
  }

  function handleArchive () {
    updateStatus ({
      id:assignment.id,
      status:"archived"
    })
  }

  function handleDraft () {
    updateStatus ({
      id:assignment.id,
      status:"draft"
    })
  }

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

              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

                <Modal.Open opens="delete">
                    <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>

                <Modal.Open opens="seeDetail">
                    <Menus.Button icon={<FaRegEye />}> See Detail</Menus.Button>
                </Modal.Open>

                <Modal.Open opens="draft">
                    <Menus.Button icon={<RiDraftLine />}> Draft </Menus.Button>
                </Modal.Open>

                <Modal.Open opens="published">
                    <Menus.Button icon={<TiTick />}> Published </Menus.Button>
                </Modal.Open>

                <Modal.Open opens="archived">
                    <Menus.Button icon={<PiArchiveDuotone />}> Archived </Menus.Button>
                </Modal.Open>


            </Menus.List>

            <Modal.Window name="edit">
              <CreateAssignmentsForm assignmentToEdit={assignment} />
            </Modal.Window>

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

            <Modal.Window name="published">
              <ConfirmStatusAction
                status="published"
                title="Publish assignment"
                message="Students will be able to see and submit this assignment."
                confirmLabel="Publish"
                confirmVariation="primary"
                onConfirm={handlePublish}
              />
            </Modal.Window>

            <Modal.Window name="archived">
              <ConfirmStatusAction
                status="archived"
                title="Archive assignment"
                message="This assignment will no longer accept submissions."
                confirmLabel="Archive"
                confirmVariation="danger"
                onConfirm={handleArchive}
              />
            </Modal.Window>

            <Modal.Window name="draft">
              <ConfirmStatusAction
                status="draft"
                title="Move to draft"
                message="Students will no longer see this assignment."
                confirmLabel="Move to draft"
                confirmVariation="secondary"
                onConfirm={handleDraft}
              />
            </Modal.Window>


          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}