import { safeRetrieveSecret, safeStoreSecret } from "../../../util/enc-server"

const WALLET_SECRET_SET_KEYWORD = "secret stored (re-type to reset)"

const encryptWalletSecret = async (walletExtId, secretTag, secret) => {
    const secretName = `red_wallet_${walletExtId}_${secretTag}`
    const res = await safeStoreSecret(secretName, secret)
    if(res) return WALLET_SECRET_SET_KEYWORD
    else return "failed to store, try again"
}

const decryptWalletSecret = async (walletExtId, secretTag) => {
    const secretName = `red_wallet_${walletExtId}_${secretTag}`
    return await safeRetrieveSecret(secretName)
}


export { encryptWalletSecret, decryptWalletSecret }