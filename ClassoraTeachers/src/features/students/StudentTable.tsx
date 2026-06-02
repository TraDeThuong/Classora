import Menus from "../../components/Menus";
import Table from "../../components/Table";
import StudentRow from "./StudentRow";

interface StudentTableProps {
  students: any[];
  classId: number;
}

export default function StudentTable({ students , classId}: StudentTableProps) {
return (
  <Menus>
    <div className="w-full overflow-x-auto rounded-3xl">
      <div className="min-w-260">
        <Table columns="0.7fr 2fr 2.5fr 1fr 0.5fr">
          <Table.Header>
            <div className="text-sm sm:text-base">Avatar</div>
            <div className="text-sm sm:text-base">Student Name</div>
            <div className="text-sm sm:text-base">Email</div>
            <div className="text-sm sm:text-base">Status</div>
            <div></div>
          </Table.Header>

          <Table.Body
            data={students}
            render={(student) => (
              <StudentRow
                key={student.id}
                student={student}
                classId={classId}
              />
            )}
          />
        </Table>
      </div>
    </div>
  </Menus>
);
}