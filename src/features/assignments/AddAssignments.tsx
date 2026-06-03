import { useEffect, useState } from "react";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import CreateAssignmentsForm from "./CreateAssignmentsForm";

export default function AddAssignments() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <Modal>
        <Modal.Open opens="assignment-form">
          <div className="text-brand-50">
            <Button
              size={isMobile ? "small" : "large"}
              variation="primary"
            >
              Create Assignment
            </Button>
          </div>
        </Modal.Open>

        <Modal.Window name="assignment-form">
          <CreateAssignmentsForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}