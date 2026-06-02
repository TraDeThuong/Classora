import Logout from "./Logout";
import UserAvatar from "./UserAvartar";
import Logo from "./Logo";

export default function Header() {
  return (
    <header
      className="
        flex items-center justify-between
        h-16 px-3
        sm:h-20 sm:px-6
        lg:h-24 lg:px-8
      "
    >
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