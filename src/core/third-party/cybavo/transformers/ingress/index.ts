import { CallbackState } from "../../model/CallbackState";
import { ProcessingState } from "../../model/ProcessingState";

const transformTxnCallbackToAssetTxnState = (callbackState: number, processingState: number, orderId: string, tokenAddress: string, walletId: string, txid: string, addon: any) => {
    // try {
    //     if(typeof callbackState == "undefined" || typeof processingState == "undefined" || !orderId ||  !walletId || !txid || !addon) throw "missing params"
    //     let syncedOnChain
    //     let originChainState = ""
    //     let txnStatus
    //     let tokenId
    //     let statusReason = ""
    
    //     if (callbackState === CallbackState.InChain && processingState === ProcessingState.Done) {
    //         txnStatus = TxnStatus.SUCCESS
    //         originChainState = "InChainDone"
    //         tokenId = addon.token_id
    //         statusReason = "Transaction was confirmed on blockchain by Cybavo."
    //         syncedOnChain = true

    //     } else if (callbackState === CallbackState.Failed || callbackState === CallbackState.InChainFailed) {
    //         txnStatus = TxnStatus.FAIL
    //         originChainState = "InChainFailed"
    //         tokenId = -1
    //         statusReason = addon.err_reason
    //         syncedOnChain = true
    //     }
    
    //     const GovOnChainTxState: GovOnChainTxState = {
    //         tokenId: tokenId,
    //         txnId: txid,
    //         syncedOnChain: syncedOnChain,
    //         txnStatus: txnStatus,
    //         originInChainState: originChainState,
    //         contractAddress: tokenAddress,
    //         statusReason: statusReason,
    //         walletExtId: walletId
    //     }
    
    //     return GovOnChainTxState
    // } catch (error) {
    //     console.log("transformTxnCallbackToAssetTxnState > error: ", error)
    //     return false
    // }

}

export { transformTxnCallbackToAssetTxnState }