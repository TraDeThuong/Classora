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
      <Table columns="0.7fr 2fr 2.5fr 1fr 0.5fr">
        <Table.Header>
          <div>Avatar</div>
          <div>Student Name</div>
          <div>Email</div>
          <div>Status</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={students}
          render={(student) => (
            <StudentRow 
                key={student.id} 
                student={student} 
                classId={classId}/>
          )}
        />
      </Table>
    </Menus>
  );
}