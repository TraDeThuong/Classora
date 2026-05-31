import Table from "../../components/Table";

interface AssignmentRowProps {
  assignment: {
    id: number;
    title: string;
    type: string;
    due_date: string | null;
    status: string;
  };
  classCode: string;
}

export default function AssignmentRow({assignment,classCode}: AssignmentRowProps){
  const { title, type, due_date, status } = assignment;


  const dueDate = due_date
    ? new Date(due_date).toLocaleDateString("vi-VN")
    : "No due date";

  return (
    <Table.Row>
      <div></div>

      <div className="font-semibold text-brand-300">{title}</div>

      <div>{classCode}</div>

      <div className="capitalize text-brand-300">{type}</div>

      <div className="text-brand-300">{dueDate}</div>

      <div>
        <span
          className={`
            rounded-full px-3 py-1 text-sm font-semibold capitalize

            ${
              status === "published"
                ? "bg-green-500/20 text-green-300"
                : status === "draft"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : "bg-red-500/20 text-red-300"
            }
          `}
        >
          {status}
        </span>
      </div>

      <div></div>
    </Table.Row>
  );
}