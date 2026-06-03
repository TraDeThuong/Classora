import type { AssignmentStatus, DisplayAssignmentStatus } from "../types/assignments";


interface AssignmentStateInput {
  status: AssignmentStatus;
  publish_time: string;
  due_date: string;
}

export function getAssignmentState(
  assignment: AssignmentStateInput
): DisplayAssignmentStatus {
  const now = new Date();
  const publishTime = new Date(assignment.publish_time);
  const dueDate = new Date(assignment.due_date);

  if (assignment.status === "draft") return "draft";
  if (assignment.status === "archived") return "archived";

  if (now < publishTime) return "scheduled";
  if (now > dueDate) return "closed";

  return "active";
}