import {
  HiAcademicCap,
  HiBookOpen,
  HiClipboardList,
  HiOutlineHome,
} from "react-icons/hi";

import NavItem from "./NavItem";

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
          <NavItem to="/results" icon={HiBookOpen}>
            Profile
          </NavItem>
        </li>

      </ul>
    </nav>
  );
}