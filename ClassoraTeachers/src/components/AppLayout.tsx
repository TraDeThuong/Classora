import { useState } from "react";
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

  return (
    <div
      className="
        relative grid min-h-screen grid-cols-[5.6rem_1fr] grid-rows-[auto_1fr] gap-4
        overflow-hidden bg-gradient-brand-300 bg-cover bg-center bg-no-repeat p-3
        lg:h-screen lg:grid-cols-[26rem_1fr] lg:p-4
      "
    >
      <header
        className="
          col-span-2 rounded-3xl border border-white/20
          bg-white/50 shadow-lg backdrop-blur-xl
        "
      >
        <Header />
      </header>

      <aside
        className="
          rounded-3xl border border-white/20 bg-white/40
          shadow-lg backdrop-blur-xl
        "
      >
        <button
          type="button"
          onClick={toggleSidebar}
          className="
            flex h-full w-full items-start justify-center p-3 pt-5
            text-white transition-all duration-300
            hover:bg-white/10 active:scale-95
            focus:outline-none focus:ring-0
            lg:hidden
          "
        >
        </button>

        <div className="hidden h-full lg:block">
          <Sidebar />
        </div>
      </aside>

      <aside
        className={`
          fixed left-3 top-36 z-50 h-[calc(100vh-10rem)] w-104
          rounded-3xl border border-white/20 bg-white/40
          shadow-lg backdrop-blur-xl transition-all duration-300
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

      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 lg:hidden"
        />
      )}

      <main
        className="overflow-y-auto rounded-3xl bg-gradient-brand-100 px-6 py-8 lg:px-[4.8rem] lg:pb-[6.4rem] lg:pt-16">
        <div className="mx-auto flex w-full max-w-480 flex-col gap-[3.2rem]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}