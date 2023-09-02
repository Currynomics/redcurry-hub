import { updateGovTxState } from "../../../assets/services";
import { EVENT_LEVELS, reportIssue } from "../../../util/reporting";
import { transformTxnCallbackToAssetTxnState } from "../transformers/ingress";

const EVENT_TYPE_TRANSACTION_STATUS_UPDATED = 'TRANSACTION_STATUS_UPDATED';
const EVENT_TYPE_TRANSACTION_CREATED = 'TRANSACTION_CREATED';
const EVENT_TYPE_TRANSACTION_APPROVAL_STATUS_UPDATED = 'TRANSACTION_APPROVAL_STATUS_UPDATED';
const EVENT_TYPE_VAULT_ACCOUNT_ADDED = 'VAULT_ACCOUNT_ADDED';
const EVENT_TYPE_VAULT_ACCOUNT_ASSET_ADDED = 'VAULT_ACCOUNT_ASSET_ADDED';
const EVENT_TYPE_INTERNAL_WALLET_ASSET_ADDED = 'INTERNAL_WALLET_ASSET_ADDED';
const EVENT_TYPE_EXTERNAL_WALLET_ASSET_ADDED = 'EXTERNAL_WALLET_ASSET_ADDED';
const EVENT_TYPE_EXCHANGE_ACCOUNT_ADDED = 'EXCHANGE_ACCOUNT_ADDED';
const EVENT_TYPE_FIAT_ACCOUNT_ADDED = 'FIAT_ACCOUNT_ADDED';
const EVENT_TYPE_NETWORK_CONNECTION_ADDED = 'NETWORK_CONNECTION_ADDED';

// docs: https://developers.fireblocks.com/reference/event-types
const FB_CALLBACK_TYPES = {
    EVENT_TYPE_TRANSACTION_STATUS_UPDATED,
    EVENT_TYPE_TRANSACTION_CREATED,
    EVENT_TYPE_TRANSACTION_APPROVAL_STATUS_UPDATED,
    EVENT_TYPE_VAULT_ACCOUNT_ADDED,
    EVENT_TYPE_VAULT_ACCOUNT_ASSET_ADDED,
    EVENT_TYPE_INTERNAL_WALLET_ASSET_ADDED,
    EVENT_TYPE_EXTERNAL_WALLET_ASSET_ADDED,
    EVENT_TYPE_EXCHANGE_ACCOUNT_ADDED,
    EVENT_TYPE_FIAT_ACCOUNT_ADDED,
    EVENT_TYPE_NETWORK_CONNECTION_ADDED,
}


// docs: https://developers.fireblocks.com/reference/event-objects
const processFireblocksCallback = async (req, res) => {
    try {
        console.log("△ △ △ Fireblocks Callback △ △ △ ")
        if(req.body.type == FB_CALLBACK_TYPES.EVENT_TYPE_TRANSACTION_STATUS_UPDATED){
            await handleTransactionStatusUpdated(req.body)
            res.status(200).send("OK");
        }else res.status(202).send("OK");
        console.log("△ △ △ △ △ △ △ △ △ △ △ △ ")

    } catch (error) {
        console.log("processFireblocksCallback > error [B_Fireblocks_02]: ", error)
        reportIssue({ msg: "Failed to process fireblocks callback", level: EVENT_LEVELS.critical, code: "B_Fireblocks_02", trace: "processFireblocksCallback() > error: " + error.message })
        res.status(500).send(error.message);
    }
}

async function handleTransactionStatusUpdated(reqBody) {
    const govTxState = await transformTxnCallbackToAssetTxnState(reqBody.data, reqBody.timestamp)
    if(govTxState) await updateGovTxState(govTxState)
    return 
}

export { processFireblocksCallback }