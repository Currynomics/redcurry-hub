import { AssetOnChainTxState } from "../../../assets/model/OnChainStateChangeCommands";
import { updateAssetTxState } from "../../../assets/services";
import { arrayToObject } from "../../../util/formatter";
import { EVENT_LEVELS, reportIssue } from "../../../util/reporting";
import { decodeStreamResponse } from "../services";

const ASSET_EVENT_NAME_ASSET_CREATED = "AssetCreated"
const MORALIS_STREAM_TAG_ASSET_CREATED = "AssetCreated"

const ASSET_EVENT_NAME_ASSET_UPDATED = "AssetUpdated"
const MORALIS_STREAM_TAG_ASSET_UPDATED = "AssetUpdated"

const processMoralisStream = async (req, res) => {
    try {
        await sleep(2000); // force function to slow down to let the asset afterChangeHook win this race condition. todo: fix the race condition in asset hook designs (PayloadCMS limitation)
        let eventName
        const tag = req.body.tag
        if (tag == MORALIS_STREAM_TAG_ASSET_CREATED) eventName = ASSET_EVENT_NAME_ASSET_CREATED
        else if (tag == MORALIS_STREAM_TAG_ASSET_UPDATED) eventName = ASSET_EVENT_NAME_ASSET_UPDATED
        else {
            res.status(202).send("OK"); // respond 202 for Moralis health checks
            return
        } 
        
        const decodedResponse = decodeStreamResponse(req.body, eventName)
        const assetFromEvent = arrayToObject(decodedResponse.asset);

        const assetTxState: AssetOnChainTxState = {
            tokenId: undefined,
            syncedOnChain: true,
            externalId: assetFromEvent['13']    // the external ID happens to be at location index 13
        }

        if (tag == MORALIS_STREAM_TAG_ASSET_CREATED) {
            assetTxState.tokenId = assetFromEvent['0']
            if (typeof assetTxState.tokenId == "undefined") throw new Error("Cannot get tokenId from stream response.")
        }

        updateAssetTxState(assetTxState)
        res.status(200).send("OK");
    } catch (error) {
        console.log("processMoralisStream > error [B_Moralis_01]: ", error)
        reportIssue({ msg: "Failed to process Moralis Stream.", level: EVENT_LEVELS.major, code: "B_Moralis_01", trace: "processMoralisStream() > error: " + error.message })
        res.status(500).send(error.message);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

export { processMoralisStream }