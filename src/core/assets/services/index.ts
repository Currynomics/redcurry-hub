import { findCollectionItemById } from "../../payload/localApi";
import { findCollectionItem, updateCollectionNoUser } from "../../payload/localApi"
import { checkTreasuryStateCorrectness } from "../../treasury/services/state";
import { AssetOnChainTxState, GovOnChainTxState } from "../model/OnChainStateChangeCommands";
import { getAssetById } from "../repositories";
const COLLECTION_SLUG_ASSETS = "assets"

const getAssetsMetadata = async (ids) => {
    try {
        if (!ids || ids.length == 0) return { data: [], code: 404, message: "missing asset ids" }
        let result = {}
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const asset = await getAssetById(id)
            if (asset) {
                const assetMeta = {
                    assetId: id
                }
                asset.immediateOwner ? assetMeta["company"] = { id: asset.immediateOwner.id, name: asset.immediateOwner.name } : void 0;
                asset.location ? assetMeta["location"] = { id: asset.location.id, country: asset.location.country, municipality: asset.location.municipality, address: asset.location.fullAddress } : void 0;
                result[id] = assetMeta
            }
        }
        return { data: result, code: 200, message: "ok" }
    } catch (error) {
        return { data: undefined, code: 500, message: error.message }

    }
}

const updateGovTxState = async (state: GovOnChainTxState) => {
    checkTreasuryStateCorrectness()
    const assetUpdate = {
        txnId: state.txnId,
        txnHash: state.txnHash,
        txnStatus: state.txnStatus,
        statusReason: state.statusReason,
        txnStateUpdatedAt: state.createdAt
    }

    const item = await findCollectionItem(COLLECTION_SLUG_ASSETS, { eventId: { equals: state.eventId } })
    if (item && item.id) {
        const result = await updateCollectionNoUser(COLLECTION_SLUG_ASSETS, item.id.trim(), assetUpdate)
        if (!result) throw new Error("updateGovTxState | asset update failed: no update collection result")
    } else throw new Error("updateGovTxState | cannot find asset with this event ID: " + state.eventId)

    return true
}

const updateAssetTxState = async (state: AssetOnChainTxState) => {
    checkTreasuryStateCorrectness()
    const assetUpdate = { syncedOnChain: state.syncedOnChain }
    state.tokenId?assetUpdate["tokenId"] = state.tokenId: void 0;

    const item = await findCollectionItemById(COLLECTION_SLUG_ASSETS, state.externalId)
    if (item && item.id) {
        const result = await updateCollectionNoUser(COLLECTION_SLUG_ASSETS, item.id.trim(), assetUpdate)
        if (!result) throw new Error("updateAssetTxState | asset update failed: no update collection result")
    } else throw new Error("updateAssetTxState | cannot find asset with this ID: " + state.externalId)

    return true
}

const resetAssetOnChainSync = async (id: string) => {
    const update = {
        syncedOnChain: false,
        txnStatus: "pending",
        statusReason: "Hasn't reached blockchain",
        txnId: ""
    }
    const result = await updateCollectionNoUser(COLLECTION_SLUG_ASSETS, id, update)
    if (!result) console.log("resetAssetOnChainSync | asset update failed: no update collection result")
    return true
}

export { updateAssetTxState, updateGovTxState, resetAssetOnChainSync, getAssetsMetadata }