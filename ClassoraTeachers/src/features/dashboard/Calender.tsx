export default function Calendar() {
  return (
    <div className="w-full min-h-160 rounded-4xl bg-gradient-brand-200 border border-white/10 p-8 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[2.2rem] font-bold text-white">
          Calendar
        </h2>

        <button className="rounded-xl bg-white/10 px-4 py-2 text-[1.3rem] font-medium text-white transition-all duration-300 hover:bg-white/20">
          May 2026
        </button>
      </div>

      <div className="flex h-120 items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5">
        <span className="text-[1.6rem] font-medium text-white/80">
          Calendar Component Here
        </span>
      </div>
    </div>
  );
}