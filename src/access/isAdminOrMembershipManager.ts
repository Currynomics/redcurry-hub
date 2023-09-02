import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

export const isAdminOrMembershipManager: Access<any, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('membership_manager') || user?.roles?.includes('admin'));
}

export const isAdminOrMembershipManagerFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('membership_manager') || user?.roles?.includes('admin'));
}