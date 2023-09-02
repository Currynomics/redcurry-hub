import { User } from "../../payload-types";

export const isEditorOrAdminAndIsCreatedBy = (user: User) => {

  // Scenario #1 - Allow only roles admin, editor
  if (user && (user?.roles?.includes('admin') || user?.roles?.includes('editor'))) {
    // Scenario #2 - Allow only documents with the current user set to the 'createdBy' field
    // Will return access for only documents that were created by the current user
    return {
      createdBy: {
        equals: user.id,
      },
    };
  }

  // Scenario #3 - Disallow all others
  return false;
};
