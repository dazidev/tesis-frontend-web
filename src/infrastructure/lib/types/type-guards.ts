import { UserRole } from "@/interfaces";

const VALID_ROLES: UserRole[] = ["admin", "lawyer", "client"];

export function isUserRole(role: any): role is UserRole {
  return VALID_ROLES.includes(role);
}
