import { CollectionAfterChangeHook } from 'payload/types';
import { setUserSecretWords } from '../core/users/userService';

const userAfterChangeHook: CollectionAfterChangeHook = async ({
    doc, // full document data
    req, // full express request
    previousDoc, // document data before updating the collection
    operation, // name of the operation ie. 'create', 'update'
}) => {
    if(operation == "create") {
        await setUserSecretWords(doc.userSecret, doc.id)

    }
    return doc;
}

export default userAfterChangeHook;

