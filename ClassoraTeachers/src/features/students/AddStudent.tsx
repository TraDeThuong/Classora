import Button from "../../components/Button";
import Modal from "../../components/Modal";
import AddStudentForm from "./AddStudentForm";

interface AddStudentProps {
  classId: number;
}

export default function AddStudent({ classId }: AddStudentProps) {
  return (
    <div>
      <Modal>
        <Modal.Open opens="student-form">
          <div className="text-brand-50">
            <Button size="large" variation="primary">
              Add Student
            </Button>
          </div>
        </Modal.Open>

        <Modal.Window name="student-form">
          <AddStudentForm classId={classId} />
        </Modal.Window>
      </Modal>
    </div>
  );
}