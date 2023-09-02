import { Access, FieldAccess } from "payload/types";
import { User } from "../../payload-types";

/**
 * User who can update an asset is either: A) System user with asset_manager role, B) Editor or up with asset_manager role 
 * @param param0 
 * @returns 
 */
export const canCreateAsset: Access<any, User> = ({ req: { user } }) => {
    return Boolean(
        (user?.isSystem && user?.assetRoles?.includes('asset_manager')) ||
        (
            user?.roles?.includes('admin') ||
            user?.roles?.includes('editor') ||
            user?.roles?.includes('manager')
        ) &&
        (
            user?.assetRoles?.includes('asset_manager')
        )
    );
};
