import { useEffect, useState } from "react";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import CreateClassForm from "./CreateClassForm";

export default function AddClass() {
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
        <Modal.Open opens="class-form">
          <div className="text-brand-50">
            <Button
              size={isMobile ? "small" : "large"}
              variation="primary"
            >
              Create class
            </Button>
          </div>
        </Modal.Open>

        <Modal.Window name="class-form">
          <CreateClassForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}