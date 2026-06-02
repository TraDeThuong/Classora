import { useSearchParams } from "react-router-dom";

import { useAssignments } from "./useAssignments";
import Spinner from "../../components/Spinner";
import Empty from "../../components/Empty";
import Menus from "../../components/Menus";
import Table from "../../components/Table";
import AssignmentRow from "./AssignmentRow";
import { useClasses } from "../classes/useClasses";

export default function AssignmentTable() {
  const [searchParams] = useSearchParams();

  const { assignments = [], isLoading: assignmentsLoading } = useAssignments();
  const { classes = [], isLoading: classesLoading } = useClasses();

  if (assignmentsLoading || classesLoading) return <Spinner />;
  if (!assignments.length) return <Empty resourceName="assignments" />;

  const classesMap = new Map(
    classes.map((classItem) => [classItem.id, classItem]),
  );

  const classId = searchParams.get("class") || "all";
  const status = searchParams.get("status") || "all";
  const type = searchParams.get("type") || "all";

  let filteredAssignments = assignments;

  if (classId !== "all") {
    filteredAssignments = filteredAssignments.filter(
      (assignment) => String(assignment.class_id) === classId,
    );
  }

  if (status !== "all") {
    filteredAssignments = filteredAssignments.filter(
      (assignment) => assignment.status === status,
    );
  }

  if (type !== "all") {
    filteredAssignments = filteredAssignments.filter(
      (assignment) => assignment.type === type,
    );
  }

  if (!filteredAssignments.length) {
    return <Empty resourceName="matching assignments" />;
  }

  return (
    <Menus>
      <div className="w-full overflow-x-auto rounded-3xl">
        <div className="min-w-312">
          <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr 0.4fr">
            <Table.Header>
              <div></div>
              <div className="text-xs sm:text-sm lg:text-base">Title</div>
              <div className="text-xs sm:text-sm lg:text-base">Class Code</div>
              <div className="text-xs sm:text-sm lg:text-base">Type</div>
              <div className="text-xs sm:text-sm lg:text-base">Due Date</div>
              <div className="text-xs sm:text-sm lg:text-base">Status</div>
              <div></div>
            </Table.Header>

            <Table.Body
              data={filteredAssignments}
              render={(assignment) => {
                const classItem = classesMap.get(assignment.class_id);

                return (
                  <AssignmentRow
                    key={assignment.id}
                    assignment={assignment}
                    classCode={classItem?.class_code ?? "N/A"}
                  />
                );
              }}
            />
          </Table>
        </div>
      </div>
    </Menus>
  );
}