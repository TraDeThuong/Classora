import Modal from "../../components/Modal";
import CreateScheduleForm from "./CreateScheduleForm";

interface AddNewScheduleProps {
  selectedDate: Date;
}

export default function AddNewSchedule({ selectedDate }: AddNewScheduleProps) {
  return (
    <Modal>
      <Modal.Open opens="schedule-form">
        <button className="rounded-2xl bg-white/10 px-5 py-3 text-[1.4rem] font-medium text-white hover:bg-white/20">
          + New Schedule
        </button>
      </Modal.Open>

      <Modal.Window name="schedule-form">
        <CreateScheduleForm selectedDate={selectedDate} />
      </Modal.Window>
    </Modal>
  );
}