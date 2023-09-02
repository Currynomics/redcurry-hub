import { CollectionBeforeOperationHook } from 'payload/types';

const OPERATION_CREATE = "create"
const OPERATION_UPDATE = "update"

const assetBeforeOperationsHookResetSyncStatus: CollectionBeforeOperationHook = async ({
    args, // Original arguments passed into the operation
    operation, // name of the operation
}) => {
    // programmatic calls without user are ignored in hooks.
    if (!args.req.user) return args

    if (operation == OPERATION_CREATE || operation == OPERATION_UPDATE) {
        args.data.syncedOnChain = false
        args.data.txnStatus = "pending"
        args.data.statusReason = "Hasn't reached blockchain"
        args.data.txnId = ""
    }
    return args;
}

export default assetBeforeOperationsHookResetSyncStatus;

