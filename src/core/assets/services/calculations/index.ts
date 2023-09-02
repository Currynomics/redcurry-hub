import { getNAPT } from "../../../treasury";
import { checkTreasuryStateCorrectness } from "../../../treasury/services/state";
import AssetType from "../../model/enums/AssetType";
import { calculateAssetVersionCashflowChange, calculateAssetVersionNavChange, getLastSyncedAssetVersion } from "../../repositories/versions";

const OPERATION_CREATE = "create"
const OPERATION_UPDATE = "update"
const OPERATION_DELETE = "delete"
const NAPT_AT_GENESIS = 100

const getCashflow = async (asset, operation) => {
    const position = calculateAssetPosition(asset)
    console.log("calculator | getCashflow | asset.id: ", asset.id)
    console.log("calculator | getCashflow | position: ", position)

    if (asset.assetType.includes(AssetType.SHARE)) return getShareCashflow(asset, position, operation)
    else return await calculateAssetVersionCashflowChange(position.cashflow, { assetId: asset.id })
}

/**
 * Main function to calculate the value variables (NAV vars and cashflow) for an asset.
 * NB! While NAV vars are not corrected by ownership percentage, as a non NAV var, cashflow is corrected.
 * @param asset 
 * @returns 
 */
const calculateAssetPosition = (asset) => {
    // NAV = OAV + COA + OLTA OA + RAL - OAVi + OAVr
    let assetType;
    if (asset.assetType && asset.assetType.id) assetType = asset.assetType.id
    else assetType = asset.assetType;

    // cashflow: amount moving in (buy / -) or out (sale / +) of asset (relevant in source balance context)
    // recFromSale: how much has the asset made from a sale operation (for properties and shares)
    let cashflow: number = 0, recFromSale: number = 0, nav: number = 0, oav: number = 0, coa: number = 0, oa: number = 0, ral: number = 0, bd: number = 0, oavr: number = 0, oavi: number = 0
    if (assetType && assetType.includes(AssetType.SHARE)) {
        const sharePositionValues = calculateSharePositionValues(asset.shares)
        oav = sharePositionValues.value             //embed share positions current value to oav (thats how we track shares)
        recFromSale = sharePositionValues.cashflow  // embed share position cashflow into receivables from sale
        cashflow = sharePositionValues.cashflow
    } else {
        asset.oav ? oav = Number(asset.oav) : void 0;
    }

    asset.coa ? coa = Number(asset.coa) : void 0;
    asset.oa ? oa = Number(asset.oa) : void 0;
    asset.ral ? ral = Number(asset.ral) : void 0;
    asset.bd ? bd = Number(asset.bd) : void 0;
    asset.oavi ? oavi = Number(asset.oavi) : void 0;
    asset.oavr ? oavr = Number(asset.oavr) : void 0;

    nav += oav
    nav += coa
    nav += oa
    nav += ral
    nav += oavr
    nav -= bd
    nav -= oavi

    if (assetType && !assetType.includes(AssetType.SHARE)) {
        asset.recFromSale ? recFromSale = Number(asset.recFromSale) : void 0;
        if (asset.closePosition) cashflow = recFromSale
        else cashflow = -nav + recFromSale
    }

    let ownershipCoenfitsent = 1
    if (asset.ownershipPercentage > 0 || asset.ownershipPercentage < 100) ownershipCoenfitsent = asset.ownershipPercentage / 100
    // as a non NAV variable, we count the ownership percentage ( For NAV vars, we don't and send on-chain without alterations)
    const cashflowCorrected = cashflow * ownershipCoenfitsent
    console.log("calculateAssetPosition NAV: ", nav)

    return { nav, recFromSale, oav, coa, oa, ral, bd, oavi, oavr, cashflow: cashflowCorrected };
}

async function getShareCashflow(asset, position, operation) {
    let cf
    if (operation == OPERATION_CREATE) cf = position.cashflow
    else if (operation == OPERATION_DELETE) cf = await calculateAssetVersionCashflowChange(position.cashflow, { assetId: asset.id })
    else if (operation == OPERATION_UPDATE) {
        const lastAssetVersion = await getLastSyncedAssetVersion(asset.id);
        // items not added or removed from share block, calculate potential difference in cashflow to previous version.
        if (asset.shares.length == lastAssetVersion.shares.length) cf = await calculateAssetVersionCashflowChange(position.cashflow, { assetId: asset.id })
        else {
            console.log("getShareCashflow | asset.shares: ", asset.shares)
            console.log("getShareCashflow | lastAssetVersion.shares.length: ", lastAssetVersion.shares.length)
            // item amount has changed (in reality added as removal is not permitted by the system)
            const newlyAddedShares = asset.shares.slice(lastAssetVersion.shares.length);
            console.log("getShareCashflow | newlyAddedShares", newlyAddedShares)
            const newlyAddedSharePosition = calculateSharePositionValues(newlyAddedShares)
            cf = newlyAddedSharePosition.cashflow
        }
    }
    console.log("getShareCashflow | cf: ", cf)
    return cf
}


const calculateSharePositionValues = (shares) => {
    let totalShares = 0
    let positionValue = 0
    let cashflow = 0
    if (!shares) return { value: positionValue, cashflow: cashflow, shares: totalShares }

    for (let i = 0; i < shares.length; i++) {
        const share = shares[i];
        let shareValue
        // buy
        if (share.nrOfParts > 0) {
            shareValue = share.nrOfParts * share.pricePerPart
        }
        // sell
        else if (share.nrOfParts < 0) {
            if (totalShares) shareValue = (share.nrOfParts * (positionValue / totalShares))
            else shareValue = share.nrOfParts * share.pricePerPart
        }
        // general
        cashflow += -share.nrOfParts * share.pricePerPart
        totalShares += share.nrOfParts
        positionValue += shareValue
    }

    return { value: positionValue, cashflow: cashflow, shares: totalShares };
}

const calculateExpectedSupplyDelta = async (assetId, assetNav, operation) => {
    let expectedSupplyDelta = 0;

    const valid = await checkTreasuryStateCorrectness()
    if (!valid) throw new Error("Treasury state in unbalanced. Contact admin.")

    const napt = await getNAPT()
    if (napt.real == 0) expectedSupplyDelta = calculateSupplyInGenesisEvent(assetNav)
    else if (operation == OPERATION_CREATE) {
        expectedSupplyDelta = assetNav / napt.real
    } else if (operation == OPERATION_UPDATE) {
        // Update operation requires checking nav change in against last version
        const navChange = await calculateAssetVersionNavChange(assetNav, { assetId: assetId })

        expectedSupplyDelta = navChange / napt.real
    }
    console.log("expectedSupplyDelta: ", expectedSupplyDelta)
    return expectedSupplyDelta
}

function calculateSupplyInGenesisEvent(assetNav) {
    return assetNav / NAPT_AT_GENESIS
}


export { getCashflow, calculateAssetPosition, calculateSharePositionValues, calculateExpectedSupplyDelta }