import { Access, FieldAccess } from "payload/types";
import { User } from "../../payload-types";
import { isEditorOrAdminAndIsCreatedBy } from "../helpers/isEditorOrAdminAndIsCreatedBy";

export const canDeleteAsset: Access<any, User> = ({ req: { user } }) => {
    return Boolean(
        (user?.isSystem && user?.assetRoles?.includes('asset_manager')) ||              // is system used with asset_manager role
        (user?.roles?.includes('admin') && user?.assetRoles?.includes('asset_manager')) // is admin with asset_manager role
    );
};