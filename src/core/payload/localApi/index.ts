import payload, { Payload } from "payload";

const updateCollection = async (collectionName, collectionId, collectionUpdate, user) => {
    await payload.update({
        collection: collectionName, // required
        id: collectionId, // required
        data: collectionUpdate,
        depth: 2,
        locale: 'en',
        user: user,
        overrideAccess: false, // set to false, not true
        showHiddenFields: true,
        // If you are uploading a file and would like to replace
        // the existing file instead of generating a new filename,
        // you can set the following property to `true`
        overwriteExistingFiles: true,
    })
    return true
}

/**
 * Use functions with _noUser name to avoid triggering collection hooks which are reserved only for user triggered, not programmatic, events.
 * All events done via LocalAPI without use (_noUser functions) will be ignored in the Collection hooks (e.g. validation, publish, etc)
 * @param collectionName 
 * @param itemId 
 * @param itemUpdate 
 * @returns 
 */
const updateCollectionNoUser = async (collectionName, itemId, itemUpdate) => {
    try {
        await payload.update({
            collection: collectionName, // required
            id: itemId, // required
            data: itemUpdate,
            depth: 2,
            locale: 'en',
            showHiddenFields: true,
            overrideAccess: true,   
        })
        return true
    } catch (error) {
        console.error("LocalApi | updateCollectionNoUser > error: ", error)
        return false
    }
}

const findCollectionItem = async (collectionName, whereQuery, depth?) => {
    try {
        const result = await payload.find({
            collection: collectionName, // required
            depth: depth || 2,
            page: 1,
            limit: 1,
            where: whereQuery, // pass a `where` query here
            locale: 'en',
            overrideAccess: true,
            showHiddenFields: true,
        })
        if (result) return result.docs[0];
        else return false
    } catch (error) {
        console.log("findCollectionItem > error: ", error)
        return false
    }
}

const findCollectionItemById = async (collectionName: string, itemId: string) => {
    const result = await payload.findByID({
        collection: collectionName, // required
        id: itemId, // required
        depth: 2,
        showHiddenFields: true,
    })
    return result;
}


const deleteCollectionItem = async (collectionName: string, itemId: string) => {
    // Result will be the now-deleted Post document.
    const result = await payload.delete({
        collection: collectionName, // required
        id: itemId, // required
        locale: 'en',
        overrideAccess: true,
        showHiddenFields: true,
    })
    return result;
}

const createItemNoUser = async (collection, item) => {
    const res = await payload.create({
        collection: collection, // required
        data: item,
        overrideAccess: true,
        showHiddenFields: false,
    })
    return res
}

export { updateCollection, findCollectionItem, findCollectionItemById, updateCollectionNoUser, deleteCollectionItem, createItemNoUser }