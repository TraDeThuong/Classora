import Modal from "../../components/Modal";
import CreateScheduleForm from "./CreateScheduleForm";

interface AddNewScheduleProps {
  selectedDate: Date;
}

export default function AddNewSchedule({ selectedDate }: AddNewScheduleProps) {
  return (
    <Modal>
      <Modal.Open opens="schedule-form">
        <button
          className="
            w-full rounded-xl bg-white/10
            px-3 py-2 text-sm font-medium text-white
            transition hover:bg-white/20 active:scale-95
            sm:w-auto sm:rounded-2xl sm:px-5 sm:py-3 sm:text-base
            lg:text-[1.4rem]
          "
        >
          <span className="sm:hidden">+ Schedule</span>
          <span className="hidden sm:inline">+ New Schedule</span>
        </button>
      </Modal.Open>

      <Modal.Window name="schedule-form">
        <CreateScheduleForm selectedDate={selectedDate} />
      </Modal.Window>
    </Modal>
  );
}