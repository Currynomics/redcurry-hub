import { CollectionAfterChangeHook } from 'payload/types';
import { getContactWalletAddress } from '../core/contacts/contactService';
import { createPass, deletePass } from '../core/passes/passService';

const passAfterChangeHook: CollectionAfterChangeHook = async ({
    doc, // full document data
    req, // full express request
    previousDoc, // document data before updating the collection
    operation, // name of the operation ie. 'create', 'update' 
}) => {
    if(operation == "create"){
        const walletAddress = await getContactWalletAddress(doc.recipient)
        const result = await createPass(doc.id, doc.typeCode, walletAddress) 
        if(result && result.code == 200) {
            if(result.issue) throw new Error("Membership pass was sent but there were some issues, contact admin.")
        }else {
            await deletePass(doc.id)
            throw new Error(result.message)
        }
    }
    return doc
}

export default passAfterChangeHook;

