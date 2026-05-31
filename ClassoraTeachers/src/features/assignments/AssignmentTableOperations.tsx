// import Filter from "../../components/Filter";

// export default function AssignmentTableOperations() {
//   return (
//     <div
//       className="
//         my-6 rounded-3xl border border-white/20
//         bg-white/10 p-4 shadow-lg backdrop-blur-xl flex flex-col 
//         sm:my-8 sm:p-5 md:flex-row md:flex-wrap md:items-end md:justify-center gap-20
//       "
//     >
//       <Filter
//         label="Class"
//         filterField="class"
//         options={[
//           { value: "all", label: "All classes" },
//           { value: "react", label: "React" },
//           { value: "nodejs", label: "NodeJS" },
//           { value: "javascript", label: "JavaScript" },
//         ]}
//       />

//       <Filter
//         label="Status"
//         filterField="status"
//         options={[
//           { value: "all", label: "All status" },
//           { value: "draft", label: "Draft" },
//           { value: "active", label: "Active" },
//           { value: "closed", label: "Closed" },
//         ]}
//       />

//       <Filter
//         label="Type"
//         filterField="type"
//         options={[
//           { value: "all", label: "All types" },
//           { value: "mcq", label: "Multiple choice" },
//           { value: "essay", label: "Essay" },
//         ]}
//       />
//     </div>
//   );
// }

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
        my-6 flex flex-col gap-6
        rounded-3xl border border-white/20
        bg-white/10 p-4 shadow-lg backdrop-blur-xl

        sm:my-8 sm:p-5
        md:flex-row md:flex-wrap md:items-end md:justify-center md:gap-20
      "
    >
      <Filter label="Class" filterField="class" options={classOptions} />
      <Filter label="Status" filterField="status" options={statusOptions} />
      <Filter label="Type" filterField="type" options={typeOptions} />
    </div>
  );
}