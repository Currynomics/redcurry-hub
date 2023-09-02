import { User } from "../payload-types";
import { Access, FieldAccess } from "payload/types";

export const isManagerOrSystem: Access = ({ req: { user } }) => {
  return Boolean(user?.roles?.includes('manager') || user?.roles?.includes('admin') || user?.isSystem);

}


export const isManagerOrSystemFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(user?.roles?.includes('manager') || user?.roles?.includes('admin') || user?.isSystem);
}