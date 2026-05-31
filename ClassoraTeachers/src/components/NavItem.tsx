import type { IconType } from "react-icons";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  icon: IconType;
  children: string;
}

export default function NavItem({ to, icon: Icon, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-4 rounded-xl px-6 py-3 
        text-3xl font-medium transition-all duration-300
        ${
          isActive
            ? "bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-[0_4px_24px_rgba(255,255,255,0.1)]"
            : "text-white/60 border border-transparent hover:bg-white/10 hover:text-white hover:border-white/20 hover:backdrop-blur-sm"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`h-10 w-10 shrink-0 transition-all duration-300
              ${isActive ? "text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" : "text-white/50"}`}
          />
          <span className={isActive ? "drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]" : ""}>
            {children}
          </span>
        </>
      )}
    </NavLink>
  );
}