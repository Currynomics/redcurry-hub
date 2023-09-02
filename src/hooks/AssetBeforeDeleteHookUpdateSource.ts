// import { CollectionBeforeDeleteHook } from 'payload/types';
// import AssetType from '../core/assets/model/enums/AssetType';
// import { tryBalanceSourceAsset } from '../core/assets/services/balancer';
// import { getLastSyncedAssetVersion } from '../core/assets/repositories/versions';

// const OPERATION_DELETE = "delete"

// const assetBeforeDeleteHookUpdateSource: CollectionBeforeDeleteHook = async ({
//   req, // full express request
//   id, // id of document to delete
// }) => {
//   const asset = await getLastSyncedAssetVersion(id)
//   asset.id = id
//   if(asset.assetType.id.includes(AssetType.SHARE)) return; // shares don't balance on delete but during sell transaction. Enforced by beforeDeleteHookValidation
//   const opResult = await tryBalanceSourceAsset(asset, OPERATION_DELETE)
//   if (!opResult) throw new Error("Source asset cannot be balanced, contact support [code: A_Delete_Hook_Source_01]")
// }

// export default assetBeforeDeleteHookUpdateSource;

