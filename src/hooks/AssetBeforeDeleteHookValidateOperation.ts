// import { CollectionBeforeDeleteHook } from 'payload/types';
// import AssetType from '../core/assets/model/enums/AssetType';
// import { validateAssetOperation } from '../core/assets/services/validator';
// import { getLastSyncedAssetVersion } from '../core/assets/repositories/versions';

// const OPERATION_DELETE = "delete"

// const assetBeforeDeleteHookValidateOperation: CollectionBeforeDeleteHook = async ({
//   req, // full express request
//   id, // id of document to delete
// }) => {
//   const asset = await getLastSyncedAssetVersion(id)
//   asset.id = id
//   sharesMustBeSoldBeforeDelete(asset)
//   await validateAssetOperation(asset, req.user, OPERATION_DELETE)
// }

// function sharesMustBeSoldBeforeDelete(asset){
//   let nrOfSharesRemaining = 0
//   if(asset.assetType.id.includes(AssetType.SHARE)){
//     if(asset.shares.length > 0 ){
//       asset.shares.forEach(share => {
//         nrOfSharesRemaining += share.nrOfParts
//       });
//     }
//   }
//   if(nrOfSharesRemaining != 0) throw new Error("Shares must be sold before this asset can be deleted.")
// }

// export default assetBeforeDeleteHookValidateOperation;

