import { BigNumber } from "ethers";
import OwnershipType from "../../../assets/model/enums/OwnershipType";
import { calculateAssetPosition, getCashflow } from "../../../assets/services/calculations";
import { findCollectionItemById } from "../../../payload/localApi";
import { checkAddress } from "../../../third-party/ethers/ethersService";
import { getUserById } from "../../../users/repositories";
import { OwnershipType as OwnershipTypeOnChain, AssetOC, AssetType, AssetSubType, Currency, Value, AssetStatus } from "../model/AssetOC";
import { AssetPublishCommand } from "../model/AssetPublishCommand";

import at from "../../../assets/model/enums/AssetType";
import { calculateAssetVersionCashflowChange } from "../../../assets/repositories/versions";

const ASSET_COLLECTION_NAME = "assets"
const ASSET_TYPE_COLLECTION_NAME = "assetTypes"
const ASSET_DENOMINATOR = 100
const TOKEN_DENOMINATOR = 100000000
const DEFAULT_OI_BPS = 10000 // 100%

/**
 * Transforms Asset to on-chain compatible asset format.
 * @param asset 
 * About on-chain roles (FYI):
 * > creator: creator can do anything with the asset. wallet that called the transaction, filled by Assets contract.
 * > managers: can edit asset
 * > owner: nothing in context of ACL, it's only purpose is ERC721 standard's ownerOf function
 */
const transform = async (assetPublishCommand: AssetPublishCommand) => {

    const tst = await getAssetTypeAndSubType(assetPublishCommand.asset)
    let lastAuditedAt = 0;
    if (assetPublishCommand.asset.lastValueAudit) lastAuditedAt = getDateTimestamp(assetPublishCommand.asset.lastValueAudit);

    const navRelated = getNavRelated(assetPublishCommand.asset)
    const value = navRelated.value

    const assetOC: AssetOC = {
        tokenId: assetPublishCommand.asset.tokenId || 0,
        sourceId: await getSourceAssetTokenId(assetPublishCommand),
        creator: assetPublishCommand.user.wallet.address,   // will be owerwritten on-chain by Assets contract.
        managers: await getManagerAddresses(assetPublishCommand),
        owner: process.env.FB_WALLET_ADR_ASSET_OWNER,
        value: value,
        assetType: tst.type,
        assetSubType: tst.subType,
        name: assetPublishCommand.asset.title,
        status: AssetStatus.ACTIVE, // change not supported in UI yet
        ownershipType: getOnwershipType(assetPublishCommand.asset),
        lastAuditedAt: lastAuditedAt,
        externalId: assetPublishCommand.asset.id,
        supplyChanging: assetPublishCommand.asset.supplyChanging
    }
    const cashflow = BigInt(Math.round(await getCashflow(assetPublishCommand.asset, assetPublishCommand.operation) * ASSET_DENOMINATOR))
    const tokens = BigInt(Math.round(assetPublishCommand.expectedSupplyDelta * TOKEN_DENOMINATOR))
    return { assetOC, cashflow, tokens };
}

function getDateTimestamp(date) {
    try {
        console.log("getDateTimestamp | date: ", date)
        return new Date(date).getTime() / 1000; // return unix in seconds.
    } catch (error) {
        console.log("getDateTimestamp | error: ", error)
        return 0
    }

}

async function getSourceAssetTokenId(assetPublishCommand) {
    let sourceAssetTokenId;
    let sourceAssetId
    if (assetPublishCommand.asset.sourceAsset) sourceAssetId = assetPublishCommand.asset.sourceAsset
    // if (assetPublishCommand.operation == OPERATION_CREATE && assetPublishCommand.asset.sourceAsset) sourceAssetId = assetPublishCommand.asset.sourceAsset
    // else if (assetPublishCommand.operation == OPERATION_UPDATE && assetPublishCommand.asset.sourceAssetOnUpdate) sourceAssetId = assetPublishCommand.asset.sourceAssetOnUpdate
    if (sourceAssetId && sourceAssetId != 0) {
        const sourceAsset = await findCollectionItemById(ASSET_COLLECTION_NAME, sourceAssetId);
        if (!sourceAsset.tokenId) throw new Error("Cannot transform asset. Source asset missing tokenId but source assed was requested.")
        sourceAssetTokenId = BigNumber.from(sourceAsset.tokenId)
    } else sourceAssetTokenId = 0;
    return sourceAssetTokenId
}


async function getManagerAddresses(assetPublishCommand) {
    let managerAddresses = []
    managerAddresses.push(assetPublishCommand.user.wallet.address) // add calling user as manager by default.
    managerAddresses.push(process.env.FB_WALLET_ADR_ASSET_OWNER) // set redcurry asset owner as manager (just in case)
    // add other managers if present
    if (assetPublishCommand.asset.collaborators) {
        for (let i = 0; i < assetPublishCommand.asset.collaborators.length; i++) {
            const userId = assetPublishCommand.asset.collaborators[i];
            const user = await getUserById(userId)
            if (
                user.wallet && // wallet assigned
                user.wallet.address && // address set for wallet
                !managerAddresses.includes(user.wallet.address) // no duplicates
            ) managerAddresses.push(user.wallet.address)
        }
    }
    return managerAddresses
}

function getNavRelated(asset) {
    const position = calculateAssetPosition(asset)
    let oiBps = DEFAULT_OI_BPS
    if (asset.assetType.includes(at.PROPERTY) && asset.ownershipPercentage < 100) {
        oiBps = asset.ownershipPercentage * 100
    }
    const value: Value = {
        currency: Currency.EUR,
        oa: BigInt(Math.round(position.oa * ASSET_DENOMINATOR)) || BigInt(0),
        ral: BigInt(Math.round(position.ral * ASSET_DENOMINATOR)) || BigInt(0),
        bd: BigInt(Math.round(position.bd * ASSET_DENOMINATOR)) || BigInt(0),
        coa: BigInt(Math.round(position.coa * ASSET_DENOMINATOR)) || BigInt(0),
        oav: BigInt(Math.round(position.oav * ASSET_DENOMINATOR)) || BigInt(0),
        oavi: BigInt(Math.round(position.oavi * ASSET_DENOMINATOR)) || BigInt(0),
        oavr: BigInt(Math.round(position.oavr * ASSET_DENOMINATOR)) || BigInt(0),
        oi: oiBps
    }

    return { value };
}

function getOnwershipType(asset) {
    if (asset.ownerhipType === OwnershipType.DIRECT) return OwnershipTypeOnChain.DIRECT
    if (asset.ownerhipType === OwnershipType.EQUITY) return OwnershipTypeOnChain.SHARES
    if (asset.ownerhipType === OwnershipType.SHARES) return OwnershipTypeOnChain.SHARES
    else return OwnershipTypeOnChain.OTHER
}

async function getAssetTypeAndSubType(asset) {
    let type: AssetType
    let subType: AssetSubType

    const at = await findCollectionItemById(ASSET_TYPE_COLLECTION_NAME, asset.assetType);
    const atType = at.type.toLowerCase()
    const atSubType = at.subType.toLowerCase()

    if (atType.includes("share")) {
        type = AssetType.SHARE
        if (atSubType.includes("low")) subType = AssetSubType.LOW_EXPOSURE
        else if (atSubType.includes("medium")) subType = AssetSubType.MID_EXPOSURE
        else if (atSubType.includes("high")) subType = AssetSubType.HIGH_EXPOSURE
        else if (atSubType.includes("tokens") && atSubType.includes("property")) subType = AssetSubType.PROPERTY_TOKEN
        else subType = AssetSubType.OTHER
    } else if (atType.includes("cash")) {
        type = AssetType.CASH
        if (atSubType.includes("fiat")) subType = AssetSubType.FIAT
        else if (atSubType.includes("stablecoin")) subType = AssetSubType.STABLECOIN
        else subType = AssetSubType.OTHER
    } else if (atType.includes("property")) {
        type = AssetType.PROPERTY
        if (atSubType.includes("ce") || atSubType.includes("commercial")) subType = AssetSubType.COMMERCIAL
        else if (atSubType.includes("residential")) subType = AssetSubType.RESIDENTIAL
        else subType = AssetSubType.OTHER
    } else {
        throw new Error("Cannot transform asset type, no match.")
    }
    return { type, subType }
}

export { transform }
