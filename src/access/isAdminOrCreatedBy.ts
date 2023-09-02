import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

export const  isAdminOrCreatedBy: Access<any, User> = ({ req: { user } }) => {
  if(!user) return false
  if (user?.roles?.includes('admin')) return true;

  // Will return access for only documents that were created by the current user
  return {
    createdBy: {
      equals: user.id,
    },
  };

};