

import { Access } from "payload/config";
import { FieldAccess } from "payload/types";
import { User } from "../payload-types";
import { availableDistributionRoles } from "../assets/constants/distributionRoles";

export const isDistAdmin: Access<any, User> = ({ req: { user } }) => {
  return user.distributionRoles?.includes("dist_admin")
}

export const isDistAdminFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
  return user.distributionRoles?.includes("dist_admin")
}