import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import useOutsideClick from "../hooks/useOutsideClick";

type Position = {
    x: number;
    y: number;
};

type MenuContextType = {
    openId: string;
    close: () => void;
    open: (id: string) => void;
    position: Position | null;
    setPosition: React.Dispatch<React.SetStateAction<Position | null>>;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

function useMenusContext() {
    const context = useContext(MenuContext);

    if (!context) {
        throw new Error("Menus components must be used within <Menus>");
    }

    return context;
}

type MenusProps = {
     children: ReactNode;
};

type ToggleProps = {
      id: string;
};

type ListProps = {
    id: string;
    children: ReactNode;
};

type ButtonProps = {
    children: ReactNode;
    icon?: ReactNode;
    onClick?: () => void;
};

function Menu({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center justify-end">
        {children}
        </div>
    );
}

function Menus({ children }: MenusProps) {
    const [openId, setOpenId] = useState("");
    const [position, setPosition] = useState<Position | null>(null);

    const close = () => setOpenId("");
    const open = setOpenId;

    return (
        <MenuContext.Provider
        value={{ openId, close, open, position, setPosition }}
        >
        {children}
        </MenuContext.Provider>
    );
}

function Toggle({ id }: ToggleProps) {
    const { openId, close, open, setPosition } = useMenusContext();

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();

        setPosition({
        x: window.innerWidth - rect.width - rect.x,
        y: rect.y + rect.height + 8,
        });

        if (openId === "" || openId !== id) {open(id);} 
        else {close();}

    }

  return (
    <button
      onClick={handleClick}
      className=" translate-x-[0.8rem] rounded-md border-none bg-transparent p-[0.4rem] transition-all duration-200 hover:bg-grey-100 focus:outline-none [&>svg]:h-[2.4rem] [&>svg]:w-[2.4rem] [&>svg]:text-grey-700">
      <HiEllipsisVertical />
    </button>
  );
}

function List({ id, children }: ListProps) {
    const { openId, position, close } = useMenusContext();
    const ref = useOutsideClick<HTMLUListElement>(close, false);

    if (openId !== id || !position) return null;

    return createPortal(
        <ul
        ref={ref}
        style={{
            right: `${position.x}px`,
            top: `${position.y}px`,
        }} className=" fixed  z-50 rounded-lg bg-grey-0 shadow-md overflow-hidden ">
        {children}
        </ul>,
        document.body,
    );
}

function Button({ children, icon, onClick }: ButtonProps) {
    const { close } = useMenusContext();

    function handleClick() {
        onClick?.();
        close();
    }

    return (
        <li>
        <button
            onClick={handleClick}
            className="
                flex w-full items-center gap-[1.6rem] border-none bg-transparent
                px-[2.4rem] py-[1.2rem] text-left text-[1.4rem] transition-all duration-200
            hover:bg-grey-50 focus:outline-none
                [&>svg]:h-[1.6rem] [&>svg]:w-[1.6rem] [&>svg]:text-grey-400 [&>svg]:transition-all [&>svg]:duration-300 ">
            {icon}
            <span>{children}</span>
        </button>
        </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;