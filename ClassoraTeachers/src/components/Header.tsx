import { HiOutlineUser } from "react-icons/hi";
import ButtonIcon from "./ButtonIcon";
import Logout from "./Logout";
import UserAvatar from "./UserAvartar";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="flex h-30 items-center justify-between px-8">
    
        <Logo/>

        <div className="flex items-center gap-4">
            <UserAvatar />

            <ButtonIcon>
                <HiOutlineUser />
            </ButtonIcon>

            <Logout />
        </div>

    </header>
  );
}