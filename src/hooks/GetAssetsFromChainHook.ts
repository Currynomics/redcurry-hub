import { CollectionBeforeOperationHook, CollectionBeforeReadHook } from 'payload/types';

// const getAssetsFromChainHook: CollectionBeforeOperationHook = async ({
//   args, // Original arguments passed into the operation
//   operation, // name of the operation
// }) => {
const getAssetsFromChainHook: CollectionBeforeReadHook = async ({
    doc, // full document data
    req, // full express request
    query, // JSON formatted query
}) => {
    console.log("getAssetsFromChainHook | doc: ", doc)
    console.log("getAssetsFromChainHook | args: ", query)
    return doc; // Return operation arguments as necessary
}

export default getAssetsFromChainHook;

