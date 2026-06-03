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
  size?: "sm" | "md" | "lg";
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

const windowSizes = {
  sm: "max-w-[min(92vw,42rem)] p-4 sm:p-5",
  md: "max-w-[min(94vw,72rem)] p-5 sm:p-6",
  lg: "max-w-[min(96vw,112rem)] p-4 sm:p-8",
};

function Window({ children, name, size = "lg" }: WindowProps) {
  const { openName, close } = useModalContext();

  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm transition-all duration-500">
      <div
        ref={ref}
        className={`
          relative max-h-[calc(100vh-2rem)] w-full overflow-y-auto overflow-x-hidden
          rounded-2xl border border-white/20 bg-white/10 shadow-xl backdrop-blur-xl
          transition-all duration-500 sm:rounded-3xl
          ${windowSizes[size]}
        `}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 rounded-xl p-2 transition-all duration-200 hover:bg-white/10 focus:outline-none sm:right-4 sm:top-4"
        >
          <HiXMark className="h-7 w-7 text-white/70 sm:h-8 sm:w-8" />
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
