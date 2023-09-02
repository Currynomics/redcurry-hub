import { listWallets } from '../../third-party/cybavo'
import { transform } from '../transformers/ingress'
import { findCollectionItem } from '../../payload/localApi'
import Wallet from "../../../model/wallets/Wallet"

const WALLET_COLLECTION_SLUG = "wallets"

const getPublicWallets = async () => {
  try {

    const wallets = await listWallets()
    if (!wallets) return { data: undefined, code: 404, message: "NOT FOUND" }

    const walletsTransformed: Wallet[] = await transform(wallets.wallets)
    return { data: walletsTransformed, code: 200, message: "OK" }

  } catch (error) {
    return { data: undefined, code: 400, message: error.message }
  }
}

const getWalletByExternalId = async (extId) =>{
  try {
    const wallet = findCollectionItem(WALLET_COLLECTION_SLUG, {externalId: {equals: extId}}, 1)
    if(wallet) return wallet
    else throw new Error("wallet not found")
  } catch (error) {
    console.log("getWalletByExternalId > error: ", error)
    return false
  }
}

export { getPublicWallets, getWalletByExternalId };