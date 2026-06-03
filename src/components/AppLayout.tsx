import { useState } from "react";
import type { MouseEvent } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    setIsSidebarOpen((open) => !open);
  }

  function closeSidebar() {
    setIsSidebarOpen(false);
  }

  function closeSidebarOnNavigation(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeSidebar();
    }
  }

  return (
    <div
      className="
        relative min-h-screen overflow-hidden
        bg-gradient-brand-300 bg-cover bg-center bg-no-repeat
        p-2 sm:p-3 lg:p-4
        lg:grid lg:h-screen lg:grid-cols-[26rem_1fr] lg:grid-rows-[auto_1fr] lg:gap-4
      "
    >
      <header
        className="
          sticky top-2 z-30 mb-3 rounded-2xl border border-white/20
          bg-white/50 shadow-lg backdrop-blur-xl
          lg:col-span-2 lg:mb-0 lg:rounded-3xl
        "
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
      </header>

      {/* Desktop sidebar */}
      <aside
        className="
          hidden rounded-3xl border border-white/20 bg-white/40
          shadow-lg backdrop-blur-xl lg:block
        "
      >
        <Sidebar />
      </aside>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        onClick={closeSidebarOnNavigation}
        className={`
          fixed left-0 top-0 z-50 h-screen w-[78%] max-w-[32rem]
          rounded-r-3xl border-r border-white/20 bg-white/70
          p-3 shadow-2xl backdrop-blur-xl transition-all duration-300
          lg:hidden
          ${
            isSidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 pointer-events-none"
          }
        `}
      >
        <Sidebar />
      </aside>

      <main
        className="
          h-[calc(100vh-6.5rem)] overflow-y-auto rounded-2xl
          bg-gradient-brand-100 px-4 py-5
          sm:px-6 sm:py-7
          lg:h-auto lg:rounded-3xl lg:px-[4.8rem] lg:pb-[6.4rem] lg:pt-16
        "
      >
        <div className="mx-auto flex w-full max-w-[120rem] flex-col gap-8 lg:gap-[3.2rem]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
