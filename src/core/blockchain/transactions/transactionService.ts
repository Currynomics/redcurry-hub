import { PassContractService } from "../contracts/passes/PassContractService"
import { findPassByTxnHash, updatePass } from "../../passes/passService"
import * as crypto from "crypto";

require('dotenv').config();

const ALCHEMY_CALLBACK_AUTH_TOKEN = process.env.ALCHEMY_CALLBACK_AUTH_TOKEN
const ALCHEMY_CALLBACK_SIGNING_KEY = process.env.ALCHEMY_CALLBACK_SIGNING_KEY

const processTransaction = async (req: any, res: any) => {
    try {
        const isValidAlchemyReq = isValidAlchemyCallback(req)
        if (!isValidAlchemyReq) throw "Unauthenticated"
        if (req.body && req.body.type == "MINED_TRANSACTION") processMinedTransactionCallback(req, res)
        else res.status(400).send("not processed, unknown transaction")
    } catch (error) {
        res.status(500).send(error)
    }
}

const processMinedTransactionCallback = async (req, res) => {
    const {
        event: {
            transaction: { hash },
        },
    } = req.body

    if (!hash) {
        res.status(400).send("request is missing transaction hash")
        return
    }

    const pass = await findPassByTxnHash(hash)
    if (!pass) {
        res.status(400).send("no pass matching this hash")
        return
    }

    const passContractService = new PassContractService();
    const tokenIdBN = await passContractService.getPassTokenId(pass.id)
    const tokenId = tokenIdBN.toNumber()

    const contractAdr = passContractService.getContractAddress();
    const openseaUrl = process.env.OPENSEA_NFT_URL + contractAdr + "/" + tokenId

    const passUpdate = {
        openseaUrl: openseaUrl,
        tokenId: tokenId,
        isMinted: true
    }

    updatePass(pass.id, passUpdate)
    res.status(200).send("OK")
}


function isValidAlchemyCallback(
    req: any
): boolean {
    try {
        if (!req.query.token || req.query.token != ALCHEMY_CALLBACK_AUTH_TOKEN) return false
        const body = JSON.stringify(req.body) // must be raw string body, not json transformed version of the body
        const signature = req.headers["x-alchemy-signature"] // your "x-alchemy-signature" from header
        const hmac = crypto.createHmac("sha256", ALCHEMY_CALLBACK_SIGNING_KEY); // Create a HMAC SHA256 hash using the signing key
        hmac.update(body, "utf8"); // Update the token hash with the request body using utf8
        const digest = hmac.digest("hex");
        return signature === digest;
    } catch (error) {
        console.error("isValidAlchemyCallback > error: ", error)
        return false
    }

}

export { processTransaction };


 /////////////////// DOCUMENTATION /////////////////////////
/* Example payload 
{
  "app": "Alchemy Mainnet",
  "network": "MAINNET",
  "type": "MINED_TRANSACTION",
  "hash": "0x8f2fbdf411ed403034979343d5ee86e6d9a6d6b6599878c865291b75fb3432b1",
  "timestamp": "2020-06-08T22:12:57.126Z",
  "fullTransaction": {
    "hash": "0x5a4bf6970980a9381e6d6c78d96ab278035bbff58c383ffe96a0a2bbc7c02a4b",
    "blockHash": 0xaa20f7bde5be60603f11a45fc4923aab7552be775403fc00c2e6b805e6297dbe,
    "blockNumber": 0x989680,
    "from": "0x8a9d69aa686fa0f9bbdec21294f67d4d9cfb4a3e",
    "gas": "0x5208",
    "gasPrice": "0x165a0bc00",
    "input": "0x",
    "nonce": "0x2f",
    "r": "0x575d26288c1e3aa63e80eea927f54d5ad587ad795ad830149837258344a87d7c",
    "s": "0x25f5a3abf22f5b8ef6ed307a76e670f0c9fb4a71fab2621fce8b52da2ab8fe82",
    "to": "0xd69b8ff1888e78d9c337c2f2e6b3bf3e7357800e",
    "transactionIndex": 0x66,
    "v": "0x1c",
    "value": "0x1bc16d674ec80000"
  }
}


*/