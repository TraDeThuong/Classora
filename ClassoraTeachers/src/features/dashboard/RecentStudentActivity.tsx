export default function RecentStudentActivity() {
  return (
    <div
      className="w-fullmax-w-400 min-h-160 rounded-4xl bg-gradient-brand-400 p-8 shadow-xl shadow-black/10 backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-200/10 text-brand-100">
      <div className="mb-8 flex items-center justify-between">
        <h2 className=" text-[2.2rem] font-bold text-brand-200">
          Recent Student Activity
        </h2>

        <button className=" rounded-xl bg-brand-200/10 px-4 py-2 text-[1.3rem] font-medium text-brand-100 transition-all duration-300 hover:bg-brand-200/20 hover:scale-105 " >
          View all
        </button>
      </div>

      <div
        className=" flex flex-col gap-4 overflow-y-auto">
        <div
          className=" flex items-center justify-between rounded-2xl bg-white/5 p-4 transition-all duration-300 hover:bg-white/10" >
          <div>
            <p className="text-[1.5rem] font-semibold text-white">
              Huynh Thanh Tra
            </p>

            <p className="text-[1.3rem] text-grey-50">
              Nop bai tap PreTest 
            </p>
          </div>

          <span className="text-[1.2rem] text-brand-200">
            5 min ago
          </span>
        </div>

        <div
          className="flex items-center justify-between rounded-2xl bg-white/5 p-4 transition-all duration-300 hover:bg-white/10" >
          <div>
            <p className="text-[1.5rem] font-semibold text-white">
              Le Hoai Duy dang ghet
            </p>

            <p className="text-[1.3rem] text-grey-50">
              Tham gia vao lop hoc
            </p>
          </div>

          <span className="text-[1.2rem] text-brand-200">
            12 min ago
          </span>
        </div>
      </div>
    </div>
  );
}