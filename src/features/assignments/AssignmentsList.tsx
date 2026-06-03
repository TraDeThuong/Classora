import type { Assignment } from "../../types/assignments";
import AddAssignments from "./AddAssignments";
import AssignmentCard from "./AssignmentCard";

interface AssignmentsListProps {
  assignments: Assignment[];
}

export default function AssignmentsList({
  assignments,
}: AssignmentsListProps) {
  return (
    <section
      className="
        w-full
        rounded-3xl
        border border-white/20
        bg-white/50
        p-6
        backdrop-blur-xl
        shadow-xl mb-20
      "
    >
      <div className = "flex justify-end">
        <AddAssignments/>
      </div>
      
      <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">

        <div>
          <h2 className="text-4xl font-bold text-brand-200">
            Assignments
          </h2>

          <p className="mt-1 text-md text-brand-300">
            Manage and track assignments for this class
          </p>
        </div>


        <span
          className="
            rounded-full
            border border-white/20
            bg-white/10
            px-4 py-2
            text-sm
            font-medium
            text-brand-300
          "
        >
          {assignments.length} assignments
        </span>
      </div>

      <div
        className="
          grid
          grid-cols-1
          gap-5
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
          />
        ))}
      </div>
    </section>
  );
}