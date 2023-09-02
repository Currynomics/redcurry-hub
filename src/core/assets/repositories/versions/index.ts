import payload from "payload";
import { calculateAssetPosition } from "../../services/calculations";
const COLLECTION_SLUG_ASSETS = "assets"

const calculateAssetVersionCashflowChange = async (newCashflow, options: { assetId: string; lastAssetV?: undefined } | { assetId?: undefined; lastAssetV: any }) => {
    return await calculateChange({ newValue: newCashflow, valueType: "cashflow", assetId: options.assetId, lastAssetV: options.lastAssetV })
}
const calculateAssetVersionNavChange = async (newNav, options: { assetId: string; lastAssetV?: undefined } | { assetId?: undefined; lastAssetV: any }) => {
    return await calculateChange({ newValue: newNav, valueType: "nav", assetId: options.assetId, lastAssetV: options.lastAssetV })
}

const calculateChange = async ({ newValue, valueType, assetId, lastAssetV }) => {
    let lastAssetVersion
    if (lastAssetV) lastAssetVersion = lastAssetV
    else if (assetId) lastAssetVersion = await getLastSyncedAssetVersion(assetId);

    if (!lastAssetVersion) return newValue // total change is the newValue.
    else {
        const lastPosition = calculateAssetPosition(lastAssetVersion);
        const lastValue = lastPosition[valueType];
        console.log("calculateChange | newValue: ", newValue)
        console.log("calculateChange | lastValue: ", lastValue)
        console.log("calculateChange | change: ", newValue - lastValue)
        return newValue - lastValue;
    }
};

/**
 * Get the last SYNCED asset version or false if no synced versions are found. 
 * When used in before change hooks, this will hold the value before the edits are saved.
 * @param assetId 
 * @param statusFilter - asset _status value to filter. Use only when drafts is enabled (currently not)
 * @returns 
 */
const getLastSyncedAssetVersion = async (assetId: string, statusFilter?: String) => {
    const lastSyncedAsset = await getLastSyncedVersionAndId(assetId)
    if (lastSyncedAsset.versionId) return lastSyncedAsset.version
    return false;
    // const result = await getAssetVersionOrderedByDate({ parent: { equals: assetId } }) // note: result is already sorted with latest first (see query.sort above)

    // if (statusFilter) {
    //     for (let i = 0; i < result.docs.length; i++) {
    //         const doc = result.docs[i];
    //         if (doc.version && doc.version._status == statusFilter) return doc.version
    //     }
    // } else {
    //     if (result.docs.length > 0) {
    //         return result.docs[0].version // return the last version
    //     }
    // }
}

/**
 * Restores asset to previous version that was synced with blockchain.
 * If no previous version is found or no version has been synced, then does nothing and returns false.
 * @param assetId 
 * @returns 
 */
const tryRestoreToPreviousSyncedVersionNoUser = async (assetId) => {
    const lastVersionAndId = await getLastSyncedVersionAndId(assetId)

    if (!lastVersionAndId.versionId) return false
    // Result will be the restored global document.
    const restoredVersion = await payload.restoreVersion({
        collection: COLLECTION_SLUG_ASSETS,
        id: lastVersionAndId.versionId,
        depth: 2,
        overrideAccess: true,
        showHiddenFields: true,
    });
    return restoredVersion
}


async function getLastSyncedVersionAndId(assetId: string) {
    const result = await getAssetVersionOrderedByDate({ parent: { equals: assetId } }) // note: result is already sorted with latest first (see query.sort above)

    for (let i = 0; i < result.docs.length; i++) {
        const doc = result.docs[i];
        if (doc.version && doc.version.syncedOnChain) {
            return {
                versionId: doc.id,
                version: doc.version
            }
        }
    }
    return {
        versionId: "",
        version: false
    }
}

async function getAssetVersionOrderedByDate(whereQuery) {
    const result = await payload.findVersions({
        collection: COLLECTION_SLUG_ASSETS,
        depth: 1,
        limit: 10000,
        where: whereQuery,
        sort: "-updatedAt",
        locale: "en",
        overrideAccess: true,
        showHiddenFields: true,
    });
    return result;
}


export { calculateAssetVersionNavChange, calculateAssetVersionCashflowChange, getLastSyncedAssetVersion, tryRestoreToPreviousSyncedVersionNoUser }