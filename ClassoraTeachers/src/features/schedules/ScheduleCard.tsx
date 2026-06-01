import { HiTrash } from "react-icons/hi2";
import Modal from "../../components/Modal";
import type { Schedule } from "../../types/schedule";
import Menus from "../../components/Menus";
import ConfirmDelete from "../../components/ConfirmDelete";
import { useDeleteSchedule } from "./useDeleteSchedule";
import { AiOutlineCheck } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import ConfirmStatusAction from "../../components/ConfirmStatusAction";
import { useUpdateScheduleStatus } from "./useUpdateScheduleStatus";

function formatTime(time: string) {
  return time.slice(0, 5);
}

interface ScheduleCardProps {
  schedule: Schedule;
}

export default function ScheduleCard({ schedule}: ScheduleCardProps) {

  const statusStyles = {
    scheduled: "bg-green-400/20 text-green-300",
    completed: "bg-blue-400/20 text-blue-300",
    cancelled: "bg-red-400/20 text-red-300",
  };

  const {deleteSchedule, isDeleting} = useDeleteSchedule ()
  const { updateStatus, isUpdating } = useUpdateScheduleStatus();
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className = "flex justify-between">
        <div>
          <p className="text-[1.2rem] text-white/60">
            {formatTime(schedule.start_time)} -{" "}
            {formatTime(schedule.end_time)}
          </p>

          <h4 className="mt-1 text-[1.6rem] font-semibold text-white">
            {schedule.title}
          </h4>
        </div>

        <div className="mt-4">
          <Modal>
            <Menus>
              <Menus.Menu>
                <Menus.Toggle id={String(schedule.id)} />

                <Menus.List id={String(schedule.id)}>
                  <Modal.Open opens="delete">
                    <Menus.Button icon={<HiTrash />}>
                      Delete
                    </Menus.Button>
                  </Modal.Open>

                  <Modal.Open opens="completed">
                    <Menus.Button icon={<AiOutlineCheck />}>
                      Completed
                    </Menus.Button>
                  </Modal.Open>

                  <Modal.Open opens="cancelled">
                    <Menus.Button icon={<MdOutlineCancel />}>
                      Cancel
                    </Menus.Button>
                  </Modal.Open>

                </Menus.List>
              </Menus.Menu>

              <Modal.Window name="delete">
                <ConfirmDelete
                  resourceName="schedule"
                  disabled={isDeleting}
                  onConfirm={() => deleteSchedule(schedule.id)}
                />
              </Modal.Window>

              <Modal.Window name="completed">
                <ConfirmStatusAction
                  title="Mark as completed"
                  message="Are you sure this schedule has been completed?"
                  confirmLabel="Completed"
                  confirmVariation="primary"
                  disabled={isUpdating}
                  onConfirm={() =>
                    updateStatus({
                      id: schedule.id,
                      status: "completed",
                    })
                  }
                />
              </Modal.Window>

              <Modal.Window name="cancelled">
                <ConfirmStatusAction
                  title="Cancel schedule"
                  message="Are you sure you want to cancel this schedule?"
                  confirmLabel="Cancel Schedule"
                  confirmVariation="danger"
                  disabled={isUpdating}
                  onConfirm={() =>
                    updateStatus({
                      id: schedule.id,
                      status: "cancelled",
                    })
                  }
                />
              </Modal.Window>

            </Menus>
          </Modal>
        </div>
      </div>

      <p className="mt-2 text-[1.3rem] text-white/70">
        Class:{" "}
        {schedule.classes
          ? `${schedule.classes.class_code} - ${schedule.classes.class_name}`
          : "No class"}
      </p>

      {schedule.location && (
        <p className="mt-1 text-[1.3rem] text-white/60">
          Location: {schedule.location}
        </p>
      )}

      {schedule.note && (
        <p className="mt-2 text-[1.3rem] text-white/50">
          Note: {schedule.note}
        </p>
      )}

      <span   className={`mt-3 inline-block rounded-full px-3 py-1 text-[1.1rem] font-medium ${statusStyles[schedule.status || "scheduled"]}`}>
        {schedule.status || "scheduled"}
      </span>
    </div>
  );
}