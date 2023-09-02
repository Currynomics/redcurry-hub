import { validCallback } from "../auth";
import { CallbackType } from "../model/CallbackType";
import { transformTxnCallbackToAssetTxnState } from "../transformers/ingress";

const ERR_MSG_NO_ORDER_ID = "Missing required order_id in body params."
const ERR_MSG_MISSING_PARAMS = "Missing required body params."
const ERR_MSG_UNK_CALLBACK_TYPE = "Unsupported callback type: "

const processCybavoCallback = async (req, res) => {
    const result = await validCallback(req)
    if (result.pass) {
        const response = await process(req)
        res.status(response.code).send(response.message);
    } else res.status(result.code).send(result.message);
}

const process = async (req) => {
    try {
        // if (req.body.type === CallbackType.Deposit) {
        //     // note: implement as needed
        //     return { data: "OK", code: 200, message: "Received, not processed (not yet implemented)." }
        // } else if (req.body.type === CallbackType.Withdraw) {
        //     const orderId = req.body.order_id;
        //     if (!orderId) return { data: "FAIL", code: 400, message: ERR_MSG_NO_ORDER_ID }

        //     const assetTxnState = transformTxnCallbackToAssetTxnState(
        //         req.body.state,
        //         req.body.processing_state,
        //         req.body.order_id,
        //         req.body.token_address,
        //         req.body.wallet_id,
        //         req.body.txid,
        //         req.body.addon
        //     )
        //     if (!assetTxnState) return { data: "FAIL", code: 400, message: ERR_MSG_MISSING_PARAMS }
        //     else {
        //         await syncAssetOnChainState(assetTxnState)
        //         return { data: "OK", code: 200, message: "Received" }
        //     }

        // } else
        return { data: "FAIL", code: 400, message: ERR_MSG_UNK_CALLBACK_TYPE + req.body.type }
    } catch (error) {
        console.log("callback | cybavo | error: ", error)
        return { data: error, code: 500, message: error.message }
    }
}

export { process, processCybavoCallback }