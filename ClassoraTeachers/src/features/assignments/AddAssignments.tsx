
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import CreateAssignmentsForm from "./CreateAssignmentsForm";


export default function AddClass () {
  return (
      <div>
        <Modal>
          <Modal.Open opens ="cabin-form">
            <div className = "text-brand-50">
                <Button size="large" variation="primary">Create Assignment</Button>
            </div>
          </Modal.Open>

          <Modal.Window name = "cabin-form">
            <CreateAssignmentsForm/>
          </Modal.Window>

        </Modal>
      </div>
  )
}
