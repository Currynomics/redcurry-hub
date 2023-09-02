import { Access, FieldAccess } from "payload/types";
import { User } from "../../payload-types";

const hasRole = (user: User) => {
  const assetRoles = user?.assetRoles ?? [];
  return assetRoles.includes('supply_manager');
};

export const isSupplyManager: Access<any, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(hasRole(user));
}

export const isSupplyManagerFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return Boolean(hasRole(user));
}