import { HiXMark } from "react-icons/hi2";
import { createPortal } from "react-dom";
import {
  cloneElement,
  createContext,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import useOutsideClick from "../hooks/useOutsideClick";


interface ModalContextType {
  openName: string;
  open: (name: string) => void;
  close: () => void;
}

interface OpenProps {
  children: ReactElement<{ onClick?: () => void }>;
  opens: string;
}

interface WindowProps {
  children: ReactElement<{ onCloseModal?: () => void }>;
  name: string;
}

const ModalContext = createContext<ModalContextType | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal components must be used inside <Modal>");
  }

  return context;
}

function Modal({ children }: { children: ReactNode }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = (name: string) => setOpenName(name);

  return (
    <ModalContext.Provider value={{ openName, open, close }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens }: OpenProps) {
  const { open } = useModalContext();

  return cloneElement(children, {
    onClick: () => open(opens),
  });
}

function Window({ children, name }: WindowProps) {
  const { openName, close } = useModalContext();

  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm transition-all duration-500">
      <div
        ref={ref}
        className="relative w-full max-w-[min(96vw,112rem)] overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-xl backdrop-blur-xl transition-all duration-500"
      >
        <button
          onClick={close}
          className="absolute right-5 top-5 rounded-xl p-2 transition-all duration-200 hover:bg-white/10 focus:outline-none"
        >
          <HiXMark className="h-10 w-10 text-white/70" />
        </button>

        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
