import {
  HiAcademicCap,
  HiClipboardList,
  HiOutlineHome,
} from "react-icons/hi";
import { FaPeopleLine } from "react-icons/fa6";
import { PiChartBarDuotone } from "react-icons/pi";

import NavItem from "./NavItem";
import { HiOutlineUser } from "react-icons/hi2";

export default function SideBar() {
  return (
    <nav className="m-5 mt-20">
      <ul className="flex flex-col gap-3 text-brand-200">
        <li>
          <NavItem to="/teacher/dashboard" icon={HiOutlineHome}>
            Dashboard
          </NavItem>
        </li>

        <li>
          <NavItem to="/teacher/analytics" icon={PiChartBarDuotone}>
            Analytics
          </NavItem>
        </li>

        <li>
          <NavItem to="/teacher/assignments" icon={HiClipboardList}>
            Assignments
          </NavItem>
        </li>

        <li>
          <NavItem to="/teacher/classes" icon={HiAcademicCap}>
            Classes
          </NavItem>
        </li>

        <li>
          <NavItem to="/teacher/students" icon={FaPeopleLine}>
            Students
          </NavItem>
        </li>

        <li>
          <NavItem to="/teacher/profile" icon={HiOutlineUser}>
            Profile
          </NavItem>
        </li>

      </ul>
    </nav>
  );
}
