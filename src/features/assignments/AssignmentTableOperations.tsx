

import Filter from "../../components/Filter";
import { useClasses } from "../classes/useClasses";
import { useAssignments } from "./useAssignments";

export default function AssignmentTableOperations() {
    const { assignments = [] } = useAssignments();
    const { classes = []} = useClasses();

    const usedClassIds = new Set(
    assignments
        .map((assignment) => String(assignment.class_id))
        .filter(Boolean),
    );

    const classOptions = [
    { value: "all", label: "All classes" },

    ...classes
        .filter((classItem) => usedClassIds.has(String(classItem.id)))
        .map((classItem) => ({
        value: String(classItem.id),
        label: classItem.class_name,
        })),
    ];

  const statusOptions = [
    { value: "all", label: "All status" },

    ...Array.from(
      new Set(assignments.map((assignment) => assignment.status).filter(Boolean)),
    ).map((status) => ({
      value: status,
      label: status,
    })),
  ];

  const typeOptions = [
    { value: "all", label: "All types" },

    ...Array.from(
      new Set(assignments.map((assignment) => assignment.type).filter(Boolean)),
    ).map((type) => ({
      value: type,
      label: type,
    })),
  ];

  return (
    <div
      className="
        my-4 grid grid-cols-1 gap-4
        rounded-2xl border border-white/20
        bg-white/10 p-4 shadow-lg backdrop-blur-xl

        sm:my-6 sm:grid-cols-2 sm:gap-5 sm:p-5
        lg:my-8 lg:grid-cols-3 lg:gap-6
        xl:rounded-3xl
      "
    >
      <div className="w-full">
        <Filter label="Class" filterField="class" options={classOptions} />
      </div>

      <div className="w-full">
        <Filter label="Status" filterField="status" options={statusOptions} />
      </div>

      <div className="w-full">
        <Filter label="Type" filterField="type" options={typeOptions} />
      </div>
    </div>
  );
}