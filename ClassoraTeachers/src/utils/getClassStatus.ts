import type { Class } from "../types/classes";

export type ClassStatusType =
  | "active"
  | "inactive"
  | "completed"
  | "archived";

export function getClassStatus(classData: Class): ClassStatusType {
  if (classData.status === "archived") return "archived";

  const today = new Date();
  const startDate = new Date(classData.start_date);
  const endDate = new Date(classData.end_date);

  today.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (today < startDate) return "inactive";
  if (today > endDate) return "completed";

  return "active";
}