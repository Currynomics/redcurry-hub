

import { Access } from "payload/config";
import { FieldAccess } from "payload/types";
import { User } from "../../payload-types";

export const isFalse: Access<any, User> = ({ req: { user } }) => {
  // Return true if user is logged in, false if not
  return false;
}

export const isFalseFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
    // Return true or false based on if the user has an admin role
    return false;
  }