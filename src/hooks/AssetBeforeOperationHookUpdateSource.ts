import { CollectionBeforeOperationHook } from 'payload/types';
import { tryBalanceSourceAsset } from '../core/assets/services/balancer';

const OPERATION_CREATE = "create"
const OPERATION_UPDATE = "update"
// const CASCADE_OFF_STATUS = 0;

const assetBeforeOperationsHookUpdateSource: CollectionBeforeOperationHook = async ({
    args, // Original arguments passed into the operation
    operation, // name of the operation
}) => {
    // programmatic calls without user are ignored in hooks.
    if (!args.req.user) return args

    // only worry about CU operations, ignore read ops, delete is handled by beforeDelete hook.
    if (operation == OPERATION_CREATE || operation == OPERATION_UPDATE) {
        console.log("updateSourceHook | args.data.sourceAsset: ", args.data.sourceAsset)
        // ignore when asset has no source
        if (!args.data.sourceAsset) return args

        // balance source asset
        const opResult = await tryBalanceSourceAsset(args.data, operation)

        // warn if source wasn't balanced
        if (!opResult) throw new Error("Source asset cannot be balanced, contact support [code: A_Hook_Source_01]")
    }
    return args;
}

export default assetBeforeOperationsHookUpdateSource;

