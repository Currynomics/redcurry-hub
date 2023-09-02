import { ethers } from 'ethers';
import { FireblocksWeb3Provider, ChainId } from "@fireblocks/fireblocks-web3-provider";
import fs from "fs";
// import { getFireblocksClient } from '../../../third-party/fireblocks/services';

const configureEip1193Provider = (vaultIds) => {
    const payload = {
        privateKey: fs.readFileSync(process.env.FB_USER_RED_SIGNER_1_SECRET_PATH!, "utf8"),
        apiKey: process.env.FB_USER_RED_SIGNER_1_API_KEY,
        vaultAccountIds: vaultIds,
        chainId: ChainId.POLYGON_TEST,
    }
    return new FireblocksWeb3Provider(payload);
};

/**
 * Cannot use singleton as we need to set externalTxnId on each transaction and the eip1193Provider.setExternalTxId cannot be set dynbamically.
 * @param externalTxnId 
 * @returns 
 */
export const getWeb3Provider = async (vaultId?: string, externalTxnId?: string) => {
    let ids
    // let vaultIdsIndexMap
    if (externalTxnId) {
        ids = [vaultId]
        // // used for contract transactions
        // const vaults = await getVaults()
        // ids = vaults.ids
        // vaultIdsIndexMap = vaults.idIndexMap
    } else {
        // used for calling contracts
        ids = ["0"]
        // vaultIdsIndexMap  = {"0": 0}
    }
    const eip1193Provider = configureEip1193Provider(ids);
    externalTxnId ? eip1193Provider.setExternalTxId(externalTxnId) : void 0;
    console.log("getWeb3Provider | setExternalTxId to: ", externalTxnId)
    const provider = new ethers.providers.Web3Provider(eip1193Provider);
    return provider;
};


/***
 * 
 * 
 * 
 * Hello

We are using Fireblocks Web3 Provider to make the smart contract calls, not the SDK.
Getting the following error code
 1438: External Tx ID Duplicate -  The externalTxId specified in the transaction was already used in the past, please use a different one

In the SDK, externalTxId can be specified but in web3 provider it cannot. Not sure where to start to troubleshoot. Do you have any experience with this?
 */