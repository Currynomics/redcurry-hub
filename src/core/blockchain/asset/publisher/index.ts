import { getCustomerById } from "../../../customers/repositories";
import { GovernorContractInteractor } from "../../../treasury/contracts/governor/GovernorContractInteractor";
import { reportIssue } from "../../../util/reporting";
import { AssetOC } from "../model/AssetOC";
import { AssetPublishCommand } from "../model/AssetPublishCommand";
import { transform } from "../transformer/egress";

const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000"
const MAX_PUBLISH_RETRIES = 1 // todo_must: change to 3 after testing.
const ERR_MSG_MISSING_CUSTOMER_WALLET_ADR = "Selected customer is missing a wallet or wallet address."
const ERR_MSG_MISSING_CUSTOMER = "Request to mint directly but is missing customer, select customer from list."
const OPERATION_CREATE = "create"
const OPERATION_UPDATE = "update"

/**
 * Takes an asset publish request and attempts (3 x) to publish that on blockchain via an intermediary service provider (Fireblocks)
 * note: callbacks are listened in the Assets collection endpoints
 * @param assetPublishCommand 
 * @returns transaction hash when success, false after X failures.
 */
const processAndPublishAsset = async (assetPublishCommand: AssetPublishCommand) => {
    const transformedResult = await transform(assetPublishCommand);
    console.log("processAndPublishAsset | transformedResult: ", transformedResult)

    const assetOC: AssetOC = transformedResult.assetOC
    const cashflow: BigInt = transformedResult.cashflow
    const tokens: BigInt = transformedResult.tokens

    let retries = 0;
    while (retries <= MAX_PUBLISH_RETRIES) {
        try {
            const tx = await publish(
                assetOC,
                cashflow,
                tokens,
                assetPublishCommand
            )
            if (!tx) throw new Error("publish() function returned falsy")
            else return tx
        } catch (error) {
            console.error("processAndPublishAsset > error [B_Publisher_01]:", error);
            reportIssue({
                msg: "Failed to publish asset, trying again",
                level: "major",
                code: "B_Publisher_01",
                trace: "publish asset failed. Error: " + error.message,
            });
            retries++;
        }
    }

    return false
}

/**
 * Publishes asset to blockchain
 * @param asset 
 * @param cashflow 
 * @param tokens 
 * @param assetPublishCommand 
 * @returns 
 */
async function publish(asset: AssetOC, cashflow: BigInt, tokens: BigInt, assetPublishCommand: AssetPublishCommand) {
    const recipientAddress = await getRecipientAddress(assetPublishCommand.asset);

    const vaultId = assetPublishCommand.user.wallet.externalVaultId;
    const eventId = assetPublishCommand.eventId
    console.log("publish | eventId (goes to txn id): ", eventId)
    const operation = assetPublishCommand.operation
    const closePosition = assetPublishCommand.asset.closePosition

    const { sourceId } = asset;
    const interactor = await GovernorContractInteractor.createInstance(vaultId, eventId)
    if (operation === OPERATION_CREATE) {
        if (sourceId) return await interactor.createUsingSource(asset, cashflow, sourceId)
        else return await interactor.create(asset, tokens, recipientAddress);
    } else if (operation === OPERATION_UPDATE) {
        if (closePosition) {
            if (sourceId) return await interactor.burnUsingSource(asset.tokenId, cashflow, sourceId)
            else return await interactor.burn(asset.tokenId, tokens);
        } else {
            if (sourceId) return await interactor.updateUsingSource(asset, cashflow, sourceId)
            else return await interactor.update(asset, tokens, recipientAddress);
        }
    }
    return null;
}

/**
 * Retrieves customer wallet address when mint is done directly to customer.
 * @param asset 
 * @returns 
 */
async function getRecipientAddress(asset) {

    if (asset.customer && asset.mintDirect) {
        const customer = await getCustomerById(asset.customer);
        if (!customer || !customer.wallet || !customer.wallet.address) throw new Error(ERR_MSG_MISSING_CUSTOMER_WALLET_ADR)
        return customer.wallet.address
    }else if (asset.mintDirect && !asset.customer) throw new Error(ERR_MSG_MISSING_CUSTOMER)

    return EMPTY_ADDRESS;
}

export { processAndPublishAsset }
