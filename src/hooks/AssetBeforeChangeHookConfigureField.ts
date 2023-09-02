import { CollectionBeforeChangeHook } from 'payload/types';
import { availableAssetAccessRoles } from '../assets/constants/assetAccessRoles';

// const getAssetsFromChainHook: CollectionBeforeOperationHook = async ({
//   args, // Original arguments passed into the operation
//   operation, // name of the operation
// }) => {
const assetBeforeChangeHookConfigureField: CollectionBeforeChangeHook = async ({
    data, // incoming data to update or create with
    req, // full express request
    operation, // name of the operation ie. 'create', 'update'
    originalDoc, // original document
}) => {
    // if user is not asset manager, remove source id (reserved only for managers)
    if (!req.user.assetRoles.includes(availableAssetAccessRoles.asset_manager)) {
        data.sourceAsset = null
        console.log("before | data.sourceAsset: ", data.sourceAsset)
    }
    return data; // Return data to either create or update a document with
}

export default assetBeforeChangeHookConfigureField;

