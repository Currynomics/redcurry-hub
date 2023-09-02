import { findCollectionItemById } from "../../payload/localApi";

const COLLECTION_SLUG_USERS = "users"
const getUserById = async (id) => {
    if (!id) return;
    return await findCollectionItemById(COLLECTION_SLUG_USERS, id)
}

export { getUserById }
