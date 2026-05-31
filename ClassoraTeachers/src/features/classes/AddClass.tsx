
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import CreateClassForm from "./CreateClassForm";

export default function AddClass () {
  return (
      <div>
        <Modal>
          <Modal.Open opens ="cabin-form">
            <div className = "text-brand-50">
                <Button size="large" variation="primary">Create class</Button>
            </div>
          </Modal.Open>

          <Modal.Window name = "cabin-form">
            <CreateClassForm/>
          </Modal.Window>

        </Modal>
      </div>
  )
}
