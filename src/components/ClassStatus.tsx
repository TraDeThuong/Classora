interface ClassStatusProps {
  status: "active" | "inactive" | "completed" | "archived";
}

const statusConfig = {
  active:    { label: "Active",    className: "bg-emerald-100 text-emerald-700" },
  inactive:  { label: "Inactive",  className: "bg-gray-100 text-gray-500" },
  completed: { label: "Completed", className: "bg-blue-100 text-blue-700" },
  archived:  { label: "Archived",  className: "bg-amber-100 text-amber-700" },
};

export function ClassStatus({ status }: ClassStatusProps) {
  const { label, className } = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}