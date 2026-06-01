import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  size?: "small" | "medium" | "large";
  variation?: "primary" | "secondary" | "danger";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  disabled?: boolean;
}

const sizes = {
  small:  "text-[1.1rem] px-[1rem] py-[0.5rem] uppercase tracking-widest font-semibold rounded-lg",
  medium: "text-[1.3rem] px-[1.8rem] py-[1rem] font-medium rounded-[10px]",
  large:  "text-[1.5rem] px-[2.6rem] py-[1.2rem] font-medium rounded-xl",
};

const variations = {
  primary:
    "bg-brand-200 text-white shadow-[0_2px_10px_rgba(192, 119, 221, 0.35)] " +
    "hover:shadow-[0_6px_20px_rgba(142, 50, 179, 0.45)] hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105",
  secondary:
    "bg-white text-grey-700 border border-grey-200 shadow-sm " +
    "hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.03]",
  danger:
    "bg-red-500 text-white shadow-[0_2px_10px_rgba(226,75,74,0.3)] " +
    "hover:shadow-[0_6px_20px_rgba(226,75,74,0.4)] hover:-translate-y-0.5 hover:scale-[1.03] hover:brightness-105",
};

export default function Button({
  children,
  size = "medium",
  variation = "primary",
  onClick,
  type = "button",
  icon,
  disabled = false
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2
        border-0 cursor-pointer
        transition-all duration-200 ease-[cubic-bezier(.34,1.56,.64,1)]
        active:scale-[0.97] active:translate-y-0
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-400
        disabled:opacity-50 disabled:pointer-events-none
        ${sizes[size]}
        ${variations[variation]}
      `}
    >
      {icon && <span className="text-[1.1em] leading-none">{icon}</span>}
      {children}
    </button>
  );
}