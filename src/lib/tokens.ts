import { v4 as uuidv4 } from "uuid";

export function generateClientToken(): string {
  return uuidv4();
}
