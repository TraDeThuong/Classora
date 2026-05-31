interface TotalItemsProps {
  totalname: string;
  total: number;
}

export default function TotalItems({ totalname, total }: TotalItemsProps) {
  return (
    <div className="w-80 h-40 bg-gradient-brand-50 flex flex-col justify-center items-center rounded-4xl
      cursor-pointer select-none
      transition-all duration-300 ease-out
      hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl
      active:scale-[0.98] active:shadow-md">
      <span className="text-sm font-medium text-brand-400 uppercase tracking-widest">{totalname}</span>
      <span className="text-4xl font-bold text-brand-600 mt-1">{total}</span>
    </div>
  );
}