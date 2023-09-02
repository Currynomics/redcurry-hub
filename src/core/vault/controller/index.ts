import { AssetOC, AssetSubType, AssetType, Currency, OwnershipType } from "../../blockchain/asset/model/AssetOC";
import { getFireblocksClient } from "../../third-party/fireblocks/services"
import { getNAPT, getTokenEscrow, getTotalSupply, getTotalTreasuryNav, getTreasuryAsset, getTreasuryAssetCount, getTreasuryAssets, getTreasuryStats } from "../../treasury";
import { GovernorContractInteractor } from "../../treasury/contracts/governor/GovernorContractInteractor";
import { checkTreasuryStateCorrectness } from "../../treasury/services/state";
import { generateRandomString, generateRandomWords } from "../../util/encryption";
require('dotenv').config();
import { Request, Response } from 'express';


const ERR_MSG_GET_SUPPLY = "Error getting supply [code: B_Treasury_01]"
const ERR_MSG_GET_POSITION = "Error getting position [code: B_Treasury_02]"
const ERR_MSG_GET_NAPT = "Error getting napt [code: B_Treasury_03]"
const ERR_MSG_GET_STATS = "Error getting stats [code: B_Treasury_04]"
const ERR_MSG_PROCESS_SUPPLY = "Error processing supply command [code: B_Treasury_06]"
const processGetAccountDetails = async (req, res) => {
    try {
        const fbClient = await getFireblocksClient()
        if (typeof fbClient === 'string') throw new Error("Failed to create fireblock client [code: ]")
        else {
            const data = await fbClient.getAccountDetails()
            if (data) res.status(200).send(data)
            else res.status(404).send("no accounts")
        }
    } catch (error) {
        res.status(500).send(error)
    }
}


const processGetContracts = async (req, res) => {
    try {
        const fbClient = await getFireblocksClient()
        if (typeof fbClient === 'string') throw new Error("Failed to create fireblock client [code: ]")
        else {
            const data = await fbClient.getWhitelistedContracts()
            if (data) res.status(200).send(data)
            else res.status(404).send("no contracts")
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

const processCheckTreasuryState = async (req: Request, res: Response) => {
    try {
        const data = await checkTreasuryStateCorrectness()
        let message, code
        if (data) {
            message = "OK. Treasury is balanced (napt == position / supply)"
            code = 200
        } else {
            message = "NOT OK. Treasury is unbalanced (napt != position / supply)."
            code = 409
        }
        res.status(code).send(message)
    } catch (error) {
        console.log("processTreasuryStats > error [B_Treasury_04]: ", error)
        res.status(500).send(ERR_MSG_GET_STATS)
    }
}

const processSupplyCommand = async (req: Request, res: Response) => {
    try {
        const command = req.query.command
        let data
        if (command == "get") data = await getTotalSupply()
        if (command == "escrow") data = await getTokenEscrow()
        else {
            res.status(400).send("Missing valid query param 'command'")
            return 
        } 
        if (data) res.status(200).send(data)
        else throw new Error("Command recognized but no data returned from handlers")
    } catch (error) {
        console.log("processGetAssets > error [B_Treasury_06]: ", error)
        res.status(500).send(ERR_MSG_PROCESS_SUPPLY)
    }
}

const processAssetsCommand = async (req: Request, res: Response) => {
    try {
        const command = req.query.command
        const tokenId = req.query.tokenId
        let data
        if (command == "get" && tokenId) data = await getTreasuryAsset(Number(tokenId))
        else if (command == "get") data = await getTreasuryAssets()
        else if (command == "count") data = await getTreasuryAssetCount()
        else {
            res.status(400).send("Missing valid query param 'command'")
            return 
        } 
        if (data) res.status(200).send(data)
        else throw new Error("Command recognized but no data returned from handlers")
    } catch (error) {
        console.log("processGetAssets > error [B_Treasury_05]: ", error)
        res.status(500).send(ERR_MSG_GET_STATS)
    }
}

const processGetTreasuryState = async (req: Request, res: Response) => {
    try {
        const data = await getTreasuryStats()
        res.status(200).send(data)
    } catch (error) {
        console.log("processTreasuryStats > error [B_Treasury_04]: ", error)
        res.status(500).send(ERR_MSG_GET_STATS)
    }
}


const processGetTreasuryStateForChainlink = async (req: Request, res: Response) => {
    const id = generateRandomWords(3, "-")
    try {
        const data = await getTreasuryStats()
        const linkResponse = {
            "data": {
                "totalReservesInEur": data.position.real,
                "naptInEur": data.napt.real,
                "nrOfAssets": data.nrOfAssets, 
                "supplyReal": data.supply.real,
            },
            "meta": {},
            "id": id
        }
        res.status(200).send(linkResponse)
    } catch (error) {
        console.log(`CHAINLINK | processGetTreasuryStateForChainlink | Run id: ${id}. Error [B_Treasury_05]: ${error}`)
        res.status(500).send(
            {
                "error": "Error code: B_Treasury_05, contact admin."
            }
        )
    }
}

const processGetSupply = async (req: Request, res: Response) => {
    try {
        const data = await getTotalSupply()
        res.status(200).send(data)
    } catch (error) {
        console.log("processGetSupply > error [B_Treasury_01]: ", error)
        res.status(500).send(ERR_MSG_GET_SUPPLY)
    }
}

const processGetTotalPosition = async (req: Request, res: Response) => {
    try {
        const data = await getTotalTreasuryNav()
        res.status(200).send(data)
    } catch (error) {
        console.log("processGetTotalPosition > error [B_Treasury_02]: ", error)
        res.status(500).send(ERR_MSG_GET_POSITION)
    }
}
const processGetNAPT = async (req: Request, res: Response) => {
    try {
        const data = await getNAPT()
        res.status(200).send(data)
    } catch (error) {
        console.log("processGetNAPT > error [B_Treasury_03]: ", error)
        res.status(500).send(ERR_MSG_GET_NAPT)
    }
}

const processGovernorCommand = async (req: Request, res: Response) => {
    try {
        const command = req.query.command
        const tokenId = req.query.tokenId
        const tokens = req.query.tokens
        let data
        if (command == "burn" && tokenId && tokens) data = await testGovernor_burnAsset(tokenId, tokens)
        else data = await testGovernor_createAsset(req)
        res.status(200).send(data)
    } catch (error) {
        console.log("processGetAssets > error [B_Treasury_05]: ", error)
        res.status(500).send(ERR_MSG_GET_STATS)
    }
}

const testGovernor_burnAsset = async (tokenId, tokens) => {
    const eventId = generateRandomString(24)
    const vaultId = "0"
    const interactor = await GovernorContractInteractor.createInstance(vaultId, eventId)
    const tx = await interactor.burn(tokenId, tokens)
    return tx;
}

const testGovernor_createAsset = async (req) => {
    const operation = req.query.operation
    const sourceId = req.query.sourceId
    const cashflow = req.query.cashflow
    const expectedSupplyDelta = req.query.tokens
    let recipientAddress = req.query.recipientAddress

    const payload = req.body.asset
    if (!payload || !operation || !cashflow || !expectedSupplyDelta) throw new Error("missing required query params")

    if (!recipientAddress) recipientAddress = "0x0000000000000000000000000000000000000000";
    const assetOC: AssetOC = payload as AssetOC;


    const eventId = generateRandomString(24)
    const vaultId = "0"
    console.log("conversion done, Initializing GovernorContractInteractor")
    const interactor = await GovernorContractInteractor.createInstance(vaultId, eventId)
    let txn
    if (operation === "create") {
        sourceId
            ? txn = await interactor.createUsingSource(assetOC, cashflow, sourceId)
            : txn = await interactor.create(assetOC, expectedSupplyDelta, recipientAddress);
    } else if (operation === "update") {
        sourceId
            ? txn = await interactor.updateUsingSource(assetOC, cashflow, sourceId)
            : txn = await interactor.update(assetOC, expectedSupplyDelta, recipientAddress);
    }
    console.log("testGovContractInteractor | tx: ", txn)
    return txn
}




export { processSupplyCommand, processAssetsCommand, processCheckTreasuryState, processGetTreasuryState, processGetTreasuryStateForChainlink, processGetAccountDetails, processGetContracts, processGovernorCommand, processGetNAPT, processGetTotalPosition, processGetSupply }

// # GOVERNOR CONTRACT ERROR LIST:
// GOV01 - Governor: too many cash in treasury
// GOV02 - Governor: cannot decrease source.value.coa
// GOV03 - UNUSED for now. old value was - Governor: wrong cashier
// GOV04 - Governor: token validations missmatch
// GOV05 - Governor: asset is not burnable by you
// GOV06 - Governor: ASSET_MANAGER role is required for addTokens != 0
// GOV07 - Governor: can not update assetType for asset
// GOV08 - Governor: asset is not editable by you
// GOV09 - Governor: asset.supplyChanging should be true
// GOV10 - Governor: too low _noSupplyChangeNavThreshold
// GOV11 - Governor: negative NAV