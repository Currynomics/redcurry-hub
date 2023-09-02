import { findCollectionItem } from "../payload/localApi"

const getContactWalletAddress = async (contactId: string) => {
    try {
        const contact = await findCollectionItem("contacts", { id: { equals: contactId } })
        return contact.walletAddress

    } catch (error) {
        console.log("getContactWalletAddress | error: ", error)
        return false
    }
}

export {getContactWalletAddress}