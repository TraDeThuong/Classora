import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  HiAcademicCap,
  HiOutlineCalendar,
  HiClipboardList,
  HiOutlineHome,
  HiOutlineUser,
} from "react-icons/hi";
import { HiArrowRightOnRectangle, HiBars3, HiXMark } from "react-icons/hi2";
import { PiChartBarDuotone } from "react-icons/pi";
import Logo from "../../components/Logo";
import ButtonIcon from "../../components/ButtonIcon";
import { MiniSpinner } from "../../components/MiniSpinner";
import { useStudent } from "./useStudent";
import { useStudentLogout } from "./useStudentLogout";

const navItems = [
  { to: "/student/dashboard", label: "Dashboard", icon: HiOutlineHome },
  { to: "/student/classes", label: "Classes", icon: HiAcademicCap },
  { to: "/student/schedules", label: "Schedule", icon: HiOutlineCalendar },
  { to: "/student/assignments", label: "Assignments", icon: HiClipboardList },
  { to: "/student/results", label: "Results", icon: PiChartBarDuotone },
  { to: "/student/profile", label: "Profile", icon: HiOutlineUser },
];

export default function StudentLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { student } = useStudent();
  const { logoutStudent, isPending } = useStudentLogout();

  return (
    <div className="relative min-h-screen bg-gradient-brand-300 p-2 sm:p-3 lg:grid lg:grid-cols-[24rem_1fr] lg:gap-4 lg:p-4">
      <aside className="hidden rounded-3xl border border-white/20 bg-white/55 p-5 shadow-lg backdrop-blur-xl lg:block">
        <Logo to="/student/dashboard" />
        <nav className="mt-12">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
                      isActive
                        ? "bg-brand-300 text-white"
                        : "text-brand-300 hover:bg-white/50"
                    }`
                  }
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[78%] max-w-[32rem] rounded-r-3xl border-r border-white/20 bg-white/80 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Logo to="/student/dashboard" />
        <nav className="mt-10">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition ${
                      isActive
                        ? "bg-brand-300 text-white"
                        : "text-brand-300 hover:bg-white/50"
                    }`
                  }
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="min-h-[calc(100vh-1rem)] rounded-3xl bg-gradient-brand-50 p-4 shadow-xl sm:p-6 lg:p-10">
        <header className="mb-8 flex items-center justify-between rounded-2xl border border-white/60 bg-white/60 px-4 py-3 shadow-sm backdrop-blur-xl">
          <div className="flex min-w-0 items-center">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isSidebarOpen}
              className="
                mr-3 flex h-11 w-11 shrink-0 items-center justify-center
                rounded-xl border border-white/60 bg-white/50 text-brand-300
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

            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase text-brand-200">
                Student Portal
              </p>
              <h1 className="truncate text-2xl font-bold text-brand-300">
                {student?.full_name || "Student"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={student?.avatar_url || "/default_user.png"}
              alt={student?.full_name || "Student avatar"}
              className="h-12 w-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <ButtonIcon
              disabled={isPending}
              onClick={() => logoutStudent()}
            >
              {isPending ? <MiniSpinner /> : <HiArrowRightOnRectangle />}
            </ButtonIcon>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-[118rem] flex-col gap-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
