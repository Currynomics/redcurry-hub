import { findCollectionItemById } from "../../payload/localApi";
const COLLECTION_SLUG_ASSETS = "assets"

const getAssetById = async (id) => {
    try {
        if (!id) return false
        return await findCollectionItemById(COLLECTION_SLUG_ASSETS, id)
    } catch (error) {
        return false
    }
}

export { getAssetById, }
