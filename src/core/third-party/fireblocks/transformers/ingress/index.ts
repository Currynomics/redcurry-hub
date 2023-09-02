import { GovOnChainTxState, TxnStatus } from "../../../../assets/model/OnChainStateChangeCommands";

const TRANSACTION_STATUSES = {
    BLOCKED: "BLOCKED",
    BROADCASTING: "BROADCASTING",
    CANCELLED: "CANCELLED",
    COMPLETED: "COMPLETED",
    CONFIRMING: "CONFIRMING",
    FAILED: "FAILED",
    PARTIALLY_COMPLETED: "PARTIALLY_COMPLETED",
    PENDING_3RD_PARTY: "PENDING_3RD_PARTY",
    PENDING_3RD_PARTY_MANUAL_APPROVAL: "PENDING_3RD_PARTY_MANUAL_APPROVAL",
    PENDING_AML_SCREENING: "PENDING_AML_SCREENING",
    PENDING_AUTHORIZATION: "PENDING_AUTHORIZATION",
    PENDING_SIGNATURE: "PENDING_SIGNATURE",
    QUEUED: "QUEUED",
    REJECTED: "REJECTED",
    SUBMITTED: "SUBMITTED"
}

const TRANSACTION_STATUS_DESCRIPTIONS = {
    BLOCKED: "The transaction was blocked due to a policy rule.",
    BROADCASTING: "The transaction is pending broadcast to the blockchain network.",
    CANCELLED: "The transaction was canceled or rejected by the user on the Fireblocks platform or by the 3rd party service from which the funds are withdrawn.",
    COMPLETED: "Successfully completed.",
    CONFIRMING: "Pending confirmation on the blockchain.",
    FAILED: "The transaction has failed.",
    PARTIALLY_COMPLETED: "(Only for Aggregated transactions) One or more of the transaction records have completed successfully.",
    PENDING_3RD_PARTY: "The transaction is pending approval by the 3rd party service (e.g exchange).",
    PENDING_3RD_PARTY_MANUAL_APPROVAL: "The transaction is pending manual approval as required by the 3rd party, usually an email approval.",
    PENDING_AML_SCREENING: "In case the AML screening feature is enabled, the transaction is pending AML screening result.",
    PENDING_AUTHORIZATION: "The transaction is pending authorization by other users (as defined in the Transaction Authorization Policy).",
    PENDING_SIGNATURE: "The transaction is pending the initiator to sign the transaction.",
    QUEUED: "Transaction is queued. Pending for another transaction to be processed.",
    REJECTED: "The transaction was rejected by the Fireblocks system or by the 3rd party service.",
    SUBMITTED: "The transaction was submitted to the Fireblocks system and is being processed."
  }


// docs: https://developers.fireblocks.com/reference/event-objects
const transformTxnCallbackToAssetTxnState = (
    data: any,
    timestamp: number
) => {
    if (data.status === TRANSACTION_STATUSES.COMPLETED) {
        const GovOnChainTxState: GovOnChainTxState = {
            txnId: data.id,
            txnHash: data.txHash,
            eventId: data.externalTxId,
            txnStatus: TxnStatus.SUCCESS,
            txnSubStatus: data.subStatus,
            contractAddress: data.destinationAddress,
            statusReason: "As per provider: " + TRANSACTION_STATUS_DESCRIPTIONS[data.status],
            walletExtId: data.sourceAddress,
            createdAt: timestamp
        }
        return GovOnChainTxState
    }else if(data.status === TRANSACTION_STATUSES.FAILED){
        const GovOnChainTxState: GovOnChainTxState = {
            txnId: data.id,
            txnHash: data.txnHash,
            eventId: data.externalTxId,
            txnStatus: TxnStatus.FAIL,
            txnSubStatus: data.subStatus,
            contractAddress: data.destinationAddress,
            statusReason: "As per provider: " + TRANSACTION_STATUS_DESCRIPTIONS[data.status],
            walletExtId: data.sourceAddress,
            createdAt: timestamp
        }
        return GovOnChainTxState
    }
    return false
}


export { transformTxnCallbackToAssetTxnState }