import FullPageLoader from "../components/FullPageLoader";
import AddClass from "../features/classes/AddClass";
import ClassList from "../features/classes/ClassList";
import Total from "../features/classes/Total";
import { useClasses } from "../features/classes/useClasses";

export default function Classes() {
  const { classes = [], isLoading } = useClasses();

  if (isLoading)
    return (
      <FullPageLoader text="Loading classes..." />
    );
  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-end">
        <AddClass />
      </div>

      <Total />

      <ClassList classes={classes} />
    </div>
  );
}