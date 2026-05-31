import type { Class } from "../../types/classes";
import ClassCard from "./Class";

interface ClassesProps {
  classes: Class[];
}

export default function ClassList({ classes }: ClassesProps) {
  return (
    <div className="grid grid-cols-1 gap-5 justify-items-center sm:grid-cols-2 xl:grid-cols-3">
      {classes.map((classItem) => (
        <ClassCard
          key={classItem.id}
          classItem={classItem}
        />
      ))}
    </div>
  );
}