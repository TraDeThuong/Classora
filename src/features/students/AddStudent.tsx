import toast from "react-hot-toast";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import AddStudentForm from "./AddStudentForm";

interface AddStudentProps {
  classId: number;
  currentStudents: number;
  maxStudents: number;
}

export default function AddStudent({ classId, currentStudents, maxStudents }: AddStudentProps) {
  
  const isFull = currentStudents >= maxStudents;

  return (
    <div>
      <Modal>
        <Modal.Open opens={isFull ? "" : "student-form"}>
          <div className="text-brand-50">
            <Button
              size="large"
              variation="primary"
              disabled={isFull}
              onClick={() => {
                if (isFull) {
                  toast.error("This class is full. You cannot add more students.");
                }
              }}
            >
              {isFull ? "Class is full" : "Add Student"}
            </Button>
          </div>
        </Modal.Open>

        {!isFull && (
          <Modal.Window name="student-form" size="md">
            <AddStudentForm classId={classId} />
          </Modal.Window>
        )}
      </Modal>
    </div>
  );
}
