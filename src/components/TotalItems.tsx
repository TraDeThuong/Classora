import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

type CardColor = "purple" | "teal" | "amber" | "coral" | "blue";

interface TotalItemsProps {
  totalname: string;
  total: number;
  icon: React.ReactNode;
  color?: CardColor;
  to?: string;
}

const colorConfig: Record<CardColor, { icon: string; value: string }> = {
  purple: { icon: "bg-violet-50 text-brand-200",  value: "text-brand-200" },
  teal:   { icon: "bg-emerald-50 text-emerald-700", value: "text-emerald-700" },
  amber:  { icon: "bg-amber-50 text-amber-700",     value: "text-amber-700"  },
  coral:  { icon: "bg-orange-50 text-orange-700",   value: "text-orange-700" },
  blue:   { icon: "bg-blue-50 text-blue-700",       value: "text-blue-700"   },
};

export default function TotalItems({
  totalname,
  total,
  icon,
  to,
  color = "purple",
  
}: TotalItemsProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const { icon: iconClass, value: valueClass } = colorConfig[color];

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;
    const duration = 900;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(total * ease));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [total]);

  const content = (
  <>
    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
      {icon}
    </div>

    <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 sm:text-xl">
      {totalname}
    </span>

    <span ref={valueRef} className={`text-4xl font-bold ${valueClass}`}>
      {total}
    </span>
  </>
);

const className = `
  flex flex-col items-center gap-3 rounded-2xl flex-1 min-w-40
  border border-gray-100 bg-white p-6 justify-center 
  cursor-pointer select-none
  transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]
  hover:-translate-y-1 hover:scale-[1.03] hover:shadow-lg hover:border-gray-200
  active:scale-[0.97] active:shadow-none
`;

if (to) {
  return (
    <Link to={to} className={className}>
      {content}
    </Link>
  );
}

  return (
    <div className={className}>{content}</div>
  );
}