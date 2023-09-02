import { findCollectionItemById } from "../../payload/localApi";

const COLLECTION_SLUG = "customers"
const getCustomerById = async (id) => {
    if (!id) return;
    return await findCollectionItemById(COLLECTION_SLUG, id)
}

export { getCustomerById }
