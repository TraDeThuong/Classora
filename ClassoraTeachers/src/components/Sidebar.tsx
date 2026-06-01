import {
  HiAcademicCap,
  HiClipboardList,
  HiOutlineHome,
} from "react-icons/hi";

import NavItem from "./NavItem";
import { HiOutlineUser } from "react-icons/hi2";

export default function SideBar() {
  return (
    <nav className="m-5 mt-20">
      <ul className="flex flex-col gap-3 text-brand-200">
        <li>
          <NavItem to="/" icon={HiOutlineHome}>
            Dashboard
          </NavItem>
        </li>

        <li>
          <NavItem to="/assignments" icon={HiClipboardList}>
            Assignments
          </NavItem>
        </li>

        <li>
          <NavItem to="/classes" icon={HiAcademicCap}>
            Classes
          </NavItem>
        </li>

        <li>
          <NavItem to="/profile" icon={HiOutlineUser}>
            Profile
          </NavItem>
        </li>

      </ul>
    </nav>
  );
}