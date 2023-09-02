import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

const hasRole = (user: User) => {
  const roles = user?.roles ?? [];
  return roles.includes('manager') || roles.includes('admin');
};
export const isManagerOrUp: Access<any, User> = ({ req: { user } }) => {
  return Boolean(hasRole(user));

}

export const isManagerOrUpFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  return Boolean(hasRole(user));
}