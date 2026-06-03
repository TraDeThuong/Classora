import { nanoid } from "nanoid";

export function generateClassCode() {
  return `CLS-${nanoid(6).toUpperCase()}`;
}