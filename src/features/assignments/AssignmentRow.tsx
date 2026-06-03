import { 
  HiPencil,
  HiTrash,
} from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import Menus from "../../components/Menus";
import Modal from "../../components/Modal";
import Table from "../../components/Table";
import ConfirmDelete from "../../components/ConfirmDelete";
import { useDeleteAssignment } from "./useDeleteAssignment";
import { FaRegEye } from "react-icons/fa";
import CreateAssignmentsForm from "./CreateAssignmentsForm";
import ConfirmStatusAction from "../../components/ConfirmStatusAction";
import { useUpdateAssignmentStatus } from "./useUpdateAssignmentStatus";
import { RiDraftLine } from "react-icons/ri";
import { TiTick } from "react-icons/ti";
import { PiArchiveDuotone } from "react-icons/pi";
import type { Assignment } from "../../types/assignments";


interface AssignmentRowProps {
  assignment: Assignment;
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

  } = assignment;

  const navigate = useNavigate();
  const { deleteAssignment, isDeleting } = useDeleteAssignment();
  const {updateStatus} = useUpdateAssignmentStatus ()

  const isPastDue = due_date ? new Date(due_date) <= new Date() : false;
  const canPublish = status !== "published" && status !== "archived" && !isPastDue;
  const canArchive = status !== "archived";
  const canMoveToDraft = status !== "draft";



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

    <div className="text-sm font-semibold text-brand-300 sm:text-2xl">
      <Link
        to={`/teacher/assignments/${assignmentId}`}
        className="transition hover:text-brand-200 hover:underline"
      >
        {title}
      </Link>
    </div>

    <div className=" text-sm sm:text-2xl">
      {classCode}
    </div>

    <div className="capitalize text-brand-300 text-sm sm:text-2xl">
      {type}
    </div>

    <div className="text-brand-300 text-sm sm:text-2xl">
      {dueDate}
    </div>

    <div>
      <span
        className={`
          rounded-full px-2.5 py-1 text-xs sm:px-3 sm:text-2xl font-semibold capitalize
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
            <Modal.Open opens="edit">
              <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            </Modal.Open>

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
            </Modal.Open>

            <Menus.Button
              icon={<FaRegEye />}
              onClick={() => navigate(`/teacher/assignments/${assignmentId}`)}
            >
              See Detail
            </Menus.Button>

            <Modal.Open opens="draft">
              <Menus.Button icon={<RiDraftLine />} disabled={!canMoveToDraft}>
                Draft
              </Menus.Button>
            </Modal.Open>

            <Modal.Open opens="published">
              <Menus.Button icon={<TiTick />} disabled={!canPublish}>
                Published
              </Menus.Button>
            </Modal.Open>

            <Modal.Open opens="archived">
              <Menus.Button icon={<PiArchiveDuotone />} disabled={!canArchive}>
                Archived
              </Menus.Button>
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
