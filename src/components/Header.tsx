import Logout from "./Logout";
import UserAvatar from "./UserAvartar";
import Logo from "./Logo";
import { HiBars3, HiXMark } from "react-icons/hi2";

interface HeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function Header({
  isSidebarOpen = false,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header
      className="
        flex items-center justify-between
        h-16 px-3
        sm:h-20 sm:px-6
        lg:h-24 lg:px-8
      "
    >
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isSidebarOpen}
        className="
          mr-3 flex h-11 w-11 shrink-0 items-center justify-center
          rounded-xl border border-white/30 bg-white/30 text-brand-300
          shadow-sm backdrop-blur-xl transition active:scale-95
          sm:h-12 sm:w-12
          lg:hidden
        "
      >
        {isSidebarOpen ? (
          <HiXMark className="h-7 w-7" />
        ) : (
          <HiBars3 className="h-7 w-7" />
        )}
      </button>

      {/* Logo */}
      <div className="min-w-0 flex-1">
        <Logo />
      </div>

      {/* Right side */}
      <div className="ml-3 flex shrink-0 items-center gap-2 sm:gap-4">
        <UserAvatar />
        <Logout />
      </div>
    </header>
  );
}
