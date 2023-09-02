import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

export const  isEditorOrCreatedBy: Access = ({req: { user },id,data }) => {
  const isCreatedBy = {
    createdBy: {
      equals: user.id,
    },
  }

  if(!user) return false
  if (user?.roles?.includes('admin')|| user?.roles?.includes('manager') || user?.roles?.includes('editor')) return true;

  // Will return access for only documents that were created by the current user
  
  return isCreatedBy;

};