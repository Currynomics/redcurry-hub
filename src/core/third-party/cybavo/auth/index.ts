const crypto = require('crypto');
import { generateRandomString } from "../../../util/encryption";
import { getWalletByExternalId } from "../../../wallets/services"
import { decryptWalletSecret } from "../../../wallets/services/auth";

/**
 * verifying the checksum of the cybavo callback
 * @param req http request
 * @param res http response
 * @returns true (valid request) or false (invalid request)
 */
const validCallback = async (req) => {
    if (process.env.ENVIRON == "local") return { pass: true, code: 200, message: "OK" } // todo: remove after testing
    const walletExtId = req.body.wallet_id
    if (!walletExtId) return { pass: false, code: 400, message: "Missing wallet_id in request body" }

    const wallet = await getWalletByExternalId(walletExtId)
    if (!wallet) return { pass: false, code: 404, message: "Wallet not found" }
    else {
        const checksum = req.get('X-CHECKSUM');
        if (!checksum) return { pass: false, code: 400, message: "Missing checksum header" }

        // verify
        const walletApiSecret = await decryptWalletSecret(walletExtId, "apiSecret")
        const payload = JSON.stringify(req.body) + walletApiSecret;
        const buff = Buffer.from(crypto.createHash('sha256').update(payload).digest());
        const checksumVerf = buff.toString('base64').replace(/\+/g, "-").replace(/\//g, "_");

        if (!checksumVerf || checksum !== checksumVerf) return { pass: false, code: 401, message: "Unauthorized" }
        return { pass: true, code: 200, message: "OK" }
    }
}

const createWalletAuthPayload = async (walletExtId: string) => {
    if (!walletExtId) throw new Error("Missing required param walletExtId")
    const apiCode = await decryptWalletSecret(walletExtId, "apiCode")
    const apiSecret = await decryptWalletSecret(walletExtId, "apiSecret")
    const refreshToken = await decryptWalletSecret(walletExtId, "apiRefreshToken")

    return {
        extId: walletExtId,
        apiCode: apiCode,
        apiSecret: apiSecret,
        refreshToken: refreshToken
    }
}

const buildAuthHeaders = ({walletAuthPayload, reqBody, queryParams}) => {
    return {
        'X-API-CODE': walletAuthPayload.apiCode,
        'X-CHECKSUM': buildChecksum({secret:walletAuthPayload.apiSecret, reqBody: reqBody, queryParams: queryParams}),
        'User-Agent': 'nodejs',
        'Content-Type': 'application/json'
    }
}

function buildChecksum({secret, reqBody, queryParams}) {
    const r = generateRandomString(10, true);
    const t = Math.floor(Date.now() / 1000);
    
    let p = []
    if(queryParams) p = safeJsonObjectToArray(queryParams)
    
    if (!!reqBody || reqBody) {
        if (typeof reqBody === 'string') {
            p.push(reqBody);
        } else {
            p.push(JSON.stringify(reqBody));
        }
    }
    p.push(`t=${t}`, `r=${r}`);
    p.sort();
    p.push(`secret=${secret}`);
    return crypto.createHash('sha256').update(p.join('&')).digest('hex');
}

function safeJsonObjectToArray(jsonObj) {
    if (!jsonObj) return []
    const result = [];

    for (const key in jsonObj) {
        if (jsonObj.hasOwnProperty(key)) {
            result.push(`${key}=${jsonObj[key]}`);
        }
    }

    return result;

    //   const jsonObj = { start_index: 0, request_number: 3 };
    //   const resultArray = jsonObjectToArray(jsonObj);
    //   console.log(resultArray); // Output: ['start_index=0', 'request_number=3']

}

export { createWalletAuthPayload, buildAuthHeaders, validCallback, buildChecksum, safeJsonObjectToArray/*used only for unit-testing*/ }