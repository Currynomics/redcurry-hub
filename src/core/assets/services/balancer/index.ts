import { getCashflow } from "../calculations"
import { getLastSyncedAssetVersion } from "../../repositories/versions"
import { updateCollectionNoUser } from "../../../payload/localApi"
const COLLECTION_SLUG_ASSETS = "assets"

const tryBalanceSourceAsset = async (asset, operation) => {
    try {
        if (asset.sourceAsset) {
            let sourceAssetId
            if (typeof asset.sourceAsset == "string") sourceAssetId = asset.sourceAsset
            else sourceAssetId = asset.sourceAsset.id

            const cf = await getCashflow(asset, operation)
            if (cf != 0) await balanceSourceAssetNAV(asset.id, sourceAssetId, cf)
        }
        return true
    } catch (error) {
        console.log("Asset | balancer | tryBalanceSourceAsset > error: ", error.message)
        return false
    }
}

/**
 * Subtract asset nav from source asset cash positions
 * @param assetId 
 * @param sourceAssetId 
 */
async function balanceSourceAssetNAV(assetId: string, sourceAssetId: string, navChange: number) {
    if (!assetId || !sourceAssetId || typeof navChange == "undefined") throw new Error("Missing required params")
    console.log("--- bsaNAV ---")

    console.log("bsaNAV | assetId: ", assetId)
    console.log("bsaNAV | sourceAssetId: ", sourceAssetId)
    console.log("bsaNAV | navChange: ", navChange)

    const sourceAsset = await getLastSyncedAssetVersion(sourceAssetId)

    if (navChange < 0 && sourceAsset.coa < Math.abs(navChange)) throw new Error("Source asset COA position lower than expected NAV decrease")
    console.log("bsaNAV | sourceAsset.coa: ", sourceAsset.coa)
    const newSourceAssetCoa = sourceAsset.coa + navChange
    console.log("bsaNAV | newSourceAssetCoa: ", newSourceAssetCoa)

    const updateResult = await updateCollectionNoUser(COLLECTION_SLUG_ASSETS, sourceAssetId, { coa: newSourceAssetCoa })
    if (!updateResult) throw new Error("NB! source asset was not updated!")
    // if (updateResult) {
    //     console.log("bsaNAV | update done, turning cascade back on...")
    //     await updateCollectionNoUser(COLLECTION_SLUG_ASSETS, sourceAssetId, { cascade: CASCADE_ON_STATUS })
    // }


    console.log("/// bsaNAV ///")
    return true
}

export { tryBalanceSourceAsset }