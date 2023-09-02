import { CollectionBeforeOperationHook } from 'payload/types';
import { createAssetId, createSnowflakeAssetEventId } from '../core/assets/services/util';
import { validateAssetOperation } from '../core/assets/services/validator';
import { calculateAssetPosition, calculateExpectedSupplyDelta } from '../core/assets/services/calculations';
import AssetType from '../core/assets/model/enums/AssetType';
import { availableAssetAccessRoles } from '../assets/constants/assetAccessRoles';

const OPERATION_CREATE = "create"
const OPERATION_UPDATE = "update"
// const CASCADE_OFF_STATUS = 0;

const assetBeforeOperationsHookValidateOperation: CollectionBeforeOperationHook = async ({
    args, // Original arguments passed into the operation
    operation, // name of the operation
}) => {
    // programmatic calls without user are ignored in hooks.
    if (!args.req.user) return args
    
    // only worry about CU operations, ignore read ops, delete is forbitten
    if (operation == OPERATION_CREATE || operation == OPERATION_UPDATE) {
        if (operation == OPERATION_CREATE) args.data.id = createAssetId(args.data)

        let assetType = getAssetType(args.data)
        await configureAssetFields(args.data, args.req.user, operation, assetType)
        await validateAssetOperation(args.data, args.req.user, operation, assetType)
    }

    return args;
}

function getAssetType(asset) {
    if (typeof asset.assetType == "string") return asset.assetType
    else return asset.assetType.id
}

/**
 * Configures and corrects asset fields that can be automatically concluded (E.g. permitted value fields, expected supply delta, etc)
 * NB! When stripping data, use null or 0 and not undefined as Payload will merge, not replace when undefined is found.
 * @param asset 
 * @param user 
 * @param operation 
 * @param assetType 
 */
async function configureAssetFields(asset, user, operation, assetType) {
    asset.changeOperation = operation
    asset.eventId = createSnowflakeAssetEventId(asset, user.wallet)
    console.log("configureAssetFields | asset.eventId: ", asset.eventId)

    // cash asset only has COA
    if (assetType.includes(AssetType.CASH)) {
        asset.oav = 0;
        asset.oa = 0;
        asset.oavi = 0;
        asset.oavr = 0;
        asset.ral = 0;
        asset.bd = 0;
    }
    const v = calculateAssetPosition(asset)

    // share asset doesn't have COA
    if (assetType.includes(AssetType.SHARE)) {
        asset.coa = 0;
        asset.oav = v.oav
        asset.recFromSale = v.recFromSale
    }

    // property asset has all fields

    let supplyDelta = 0
    if (supplyCanChange(asset)) {
        const assetNav = calculateAssetPosition(asset).nav
        supplyDelta = await calculateExpectedSupplyDelta(asset.id, assetNav, operation)
    }
    asset.expectedSupplyDelta = supplyDelta

    // if user is not asset manager, remove source id (reserved only for managers)
    if(!user.assetRoles.includes(availableAssetAccessRoles.asset_manager)) {
        asset.sourceAsset = null        // using null instead of undefined due to PayloadCMS quirk: // If no incoming data (undefined), but existing document data is found, merge it in
    }
}

function supplyCanChange(asset) {
    if (asset.sourceAsset || !asset.supplyChanging) return false
    return true
}


export default assetBeforeOperationsHookValidateOperation;

