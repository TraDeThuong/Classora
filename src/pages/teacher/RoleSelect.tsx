import { Link } from "react-router-dom";
import { HiAcademicCap, HiClipboardList } from "react-icons/hi";

export default function RoleSelect() {
  return (
    <main className="min-h-screen bg-gradient-brand-300 px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl flex-col justify-center gap-10">
        <header className="text-center text-white">
          <img
            src="/logo.png"
            alt="Classora"
            className="mx-auto mb-5 h-28 w-28 rounded-full"
          />
          <h1 className="text-5xl font-black tracking-normal text-brand-50">
            CLASSORA
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
            Choose your portal to continue with class management or learning.
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <Link
            to="/teacher/login"
            className="group rounded-3xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white"
          >
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-300 text-white">
              <HiAcademicCap className="h-9 w-9" />
            </div>

            <h2 className="text-3xl font-bold text-brand-300">Teacher</h2>
            <p className="mt-3 text-brand-300/70">
              Manage classes, students, assignments, schedules, submissions,
              and grading.
            </p>

            <div className="mt-8 inline-flex rounded-xl bg-brand-300 px-5 py-3 font-semibold text-white transition group-hover:bg-brand-400">
              Go to teacher portal
            </div>
          </Link>

          <Link
            to="/student/login"
            className="group rounded-3xl border border-white/20 bg-white/70 p-8 shadow-xl backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white"
          >
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-200 text-white">
              <HiClipboardList className="h-9 w-9" />
            </div>

            <h2 className="text-3xl font-bold text-brand-300">Student</h2>
            <p className="mt-3 text-brand-300/70">
              Join classes, view published assignments, submit answers, and
              review your results.
            </p>

            <div className="mt-8 inline-flex rounded-xl bg-brand-200 px-5 py-3 font-semibold text-white transition group-hover:bg-brand-300">
              Go to student portal
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
