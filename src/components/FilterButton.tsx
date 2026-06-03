import type { ReactNode } from "react";

interface FilterButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function FilterButton({ children, onClick, }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-100 rounded-xl px-4 py-2 text-sm font-medium text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white">
      {children}
    </button>
  );
}