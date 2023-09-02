import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

export const isSystem: Access<any, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.isSystem == true);
}

export const isSystemFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.isSystem == true);
}