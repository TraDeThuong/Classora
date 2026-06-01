import type { Assignment } from "../../types/assignments";

const typeConfig = {
  mcq:   { label: "MCQ",   className: "bg-violet-50 text-violet-800" },
  essay: { label: "Essay", className: "bg-amber-50 text-amber-800"  },
  mixed: { label: "Mixed", className: "bg-blue-50 text-blue-800"    },
} satisfies Record<string, { label: string; className: string }>;

const statusConfig = {
  draft:     { label: "Draft",     className: "bg-gray-100 text-gray-500"       },
  published: { label: "Published", className: "bg-emerald-50 text-emerald-700"  },
  archived:  { label: "Archived",  className: "bg-red-50 text-red-700"          },
} satisfies Record<string, { label: string; className: string }>;

interface AssignmentCardProps {
  assignment: Assignment;
}

export default function AssignmentCard({ assignment }: AssignmentCardProps) {
  const dueDate = assignment.due_date
    ? new Date(assignment.due_date).toLocaleDateString("vi-VN")
    : "No due date";

  const type   = typeConfig[assignment.type]     ?? typeConfig.mixed;
  const status = statusConfig[assignment.status] ?? statusConfig.draft;

  return (
    <article className="
      group flex h-full flex-col justify-between
      rounded-2xl border border-gray-100 bg-white p-5
      transition-all duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]
      hover:-translate-y-1 hover:scale-[1.015] hover:shadow-xl
      sm:p-6
    ">
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
            {assignment.title}
          </h3>
          <span className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ${type.className}`}>
            {type.label}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-400">
          {assignment.description || "No description for this assignment."}
        </p>
      </div>

      <div className="mt-5 space-y-2 border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between text-md">
          <span className="text-gray-400">Due date</span>
          <span className="font-medium text-gray-700">{dueDate}</span>
        </div>

        <div className="flex items-center justify-between text-md">
          <span className="text-gray-400">Status</span>
          <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>
    </article>
  );
}