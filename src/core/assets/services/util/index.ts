import AssetType from "../../model/enums/AssetType";
import { generateRandomString } from "../../../util/encryption";
import { reportIssue } from "../../../util/reporting";

/**
 * Generates random unique ID for the asset
 * @param asset 
 * @returns new asset id as string
 */
const createAssetId = (asset) => {
    const id = getIdPrefix(asset) + generateRandomString(24)
    return id.trim();
}

const createSnowflakeAssetEventId = (asset, wallet) => {
    if(!wallet || !asset) {
        reportIssue({ msg: "Failed to generate asset event id", level: "critical", code: "A_Util_1", trace: "createSnowflakeAssetEventId() | missing wallet or asset in args." })
        throw new Error("Cannot generate event id [code: A_Util_1]")
    }
    const id = asset.id + "_" + generateRandomString(8) + "_" + Date.now()
    return id.trim();
}

function getIdPrefix(asset) {
    let prefix = "r_"
    try {
        if (asset.assetType.includes(AssetType.SHARE)) prefix = "share_"
        if (asset.assetType.includes(AssetType.CASH)) prefix = "cash_"
        if (asset.assetType.includes(AssetType.PROPERTY)) prefix = "property_"
    } catch (error) {
        console.error("getAssetIdPrefix > error: ", error)
    }
    return prefix;
}

export { createSnowflakeAssetEventId, createAssetId }
