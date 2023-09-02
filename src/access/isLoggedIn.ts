

import { Access } from "payload/config";
import { FieldAccess } from "payload/types";
import { User } from "../payload-types";

export const isLoggedIn: Access<any, User> = ({ req: { user } }) => {
  // Return true if user is logged in, false if not
  return Boolean(user);
}

export const isLoggedInFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user);
}