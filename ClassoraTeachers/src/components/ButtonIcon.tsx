import type { ReactNode } from "react";

interface ButtonIconProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export default function ButtonIcon({
  children,
  onClick,
}: ButtonIconProps) {
  return (
    <button
      onClick={onClick}
      className="
        relative rounded-xl p-2.5 border border-transparent dark:bg-transparent
        transition-all duration-200 ease-out hover:-translate-y-0.5
        active:scale-[0.94] active:translate-y-0
        focus:outline-none
        [&>svg]:h-8 [&>svg]:w-8 [&>svg]:text-brand-200
        [&>svg]:transition-all [&>svg]:duration-250
        hover:[&>svg]:text-brand-300 hover:[&>svg]:-rotate-[8deg] hover:[&>svg]:scale-110
        "
        >
      {children}
    </button>
  );
}