import { Access, FieldAccess } from "payload/types";
import { User } from "../../payload-types";

/**
 * Actors who can edit an asset
 * - asset managers
 * - if not asset manager, one must be a system, or author (creator)
 * @param param0 
 * @returns 
 */
export const canUpdateAsset = (assetCollaboratorsFieldName: string = 'collaborators'): Access => ({ req: { user } }) => {

    // export const canUpdateAsset: Access = ({ req: { user }, id, data }) => {
    if (user?.assetRoles?.includes('asset_manager')) return true
    // todo_consider: only allow authors with asset_manager role to edit (future feature)

    // is system user with the right role
    if (user?.isSystem && (user?.assetRoles?.includes('asset_manager') || user?.assetRoles?.includes('asset_editor'))) return true

    if (user?.assetRoles?.includes('asset_editor')) {

        return {
            or: [
                {
                    [assetCollaboratorsFieldName]: {
                        in: user.id
                    }
                }
            ]
        }
    }
    return false
};