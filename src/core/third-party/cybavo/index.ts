import { makeGetRequest, makePostRequest } from '../../util/http/requester'
import { buildAuthHeaders, createWalletAuthPayload } from './auth';
import { CybavoTransactionRequest } from './model/CybavoTransactionRequest'
const LIST_WALLETS_URI = process.env.CYBAVO_API_URL + "/v1/sofa/wallets/readonly/walletlist"
const TRANSACTION_URI = process.env.CYBAVO_API_URL + "/v1/sofa/wallets/"
const TRANSACTION_URI_SUFFIX = "/sender/transactions"

/**
 * List all wallets can be accessed by the inquiry read-only API code.
 * API documentation: https://www.cybavo.com/developers/rest-api/read-only-api/list-wallets/
 * @param args 
 * @returns 
 */
const listWallets = async (args?) => {
    try {
        const resp = await makeGetRequest({ url: LIST_WALLETS_URI, params: {}, headers: {} })
        if (resp.statusCode == 200) return resp.data;
        else throw Error(resp.data)
    } catch (error) {
        console.error("cybavoService | listWallets > error: ", error.message)
        throw error;
    }
}

const createTransactionPayload = async (transactionRequest: CybavoTransactionRequest, walletExtId: string) => {
    // console.log("createTransactionPayload | transactionRequest: ", JSON.stringify(transactionRequest))
    // console.log("createTransactionPayload |  walletExternalId: ", walletExtId)

    const url = TRANSACTION_URI + walletExtId + TRANSACTION_URI_SUFFIX
    const body = transactionRequest

    const walletAuthPayload = await createWalletAuthPayload(walletExtId)
    // console.log("createTransactionPayload |  walletAuthPayload: ", walletAuthPayload)

    const headers = await buildAuthHeaders({ walletAuthPayload: walletAuthPayload, reqBody: body, queryParams: "" })

    // console.log("createTransactionPayload |  headers: ", headers)

    return { url, body, headers }
}

const sendTransaction = async ({ url, body, headers }) => {
    try {
        const resp = await makePostRequest({ url, body, headers })
        if (resp.statusCode == 200) return resp.data;
        else throw Error(resp.data)
    } catch (error) {
        console.log("cybavoService | sendTransaction > error:", error.message)
        throw error;
    }
}


export { listWallets, createTransactionPayload, sendTransaction };