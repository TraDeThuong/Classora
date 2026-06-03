import Empty from "../../components/Empty";
import ErrorMessage from "../../components/ErrorMessage";
import FullPageLoader from "../../components/FullPageLoader";
import AddClass from "../../features/classes/AddClass";
import ClassList from "../../features/classes/ClassList";
import Total from "../../features/classes/Total";
import { useClasses } from "../../features/classes/useClasses";

export default function Classes() {
  const { classes = [], error, isLoading } = useClasses();

  if (isLoading)
    return (
      <FullPageLoader text="Loading classes..." />
    );

  if (error) {
    return <ErrorMessage message="Classes could not be loaded." />;
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-end">
        <AddClass />
      </div>

      <Total />

      {classes.length ? (
        <ClassList classes={classes} />
      ) : (
        <Empty resourceName="classes">
          <AddClass />
        </Empty>
      )}
    </div>
  );
}
