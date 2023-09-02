import { availableAssetAccessRoles } from "../../../../assets/constants/assetAccessRoles";
import AssetType from "../../model/enums/AssetType";
import { validateUserSecret } from "../../../users/userService";
import { calculateAssetPosition } from "../calculations";
import { calculateAssetVersionCashflowChange, calculateAssetVersionNavChange, getLastSyncedAssetVersion } from "../../repositories/versions";
import { getNoSupplyChangeNavThreshold, getTotalTreasuryNav } from "../../../treasury";
import WalletProvider from "../../../wallets/model/enums/WalletProvider";
import { availableDistributionRoles } from "../../../../assets/constants/distributionRoles";

const OPERATION_DELETE = "delete"
const OPERATION_UPDATE = "update"
const OPERATION_CREATE = "create"

const ERR_MSG_SUPPLY_ROLE = "Only supply managers are authorized to create supply-changing assets without a source.";
const ERR_MSG_NEG_NAV = "Asset's NAV cannot be negative.";
const ERR_MSG_NAV_IMPACT = "Total NAV impact exceeds the limit allowed without supply change.";
const ERR_MSG_USER_SECRET = "The provided user secret is invalid.";
const ERR_MSG_NO_WALLET = "This user has no assigned wallet.";
const ERR_MSG_INCOMPLETE_WALLET = "Your wallet configuration is incomplete.";
const ERR_MSG_SUPPLY_CHANGING = "This asset type can't have a variable supply.";
const ERR_MSG_EXPECTED_SUPPLY_NAN = "Expected supply delta value must be a number.";
const ERR_MSG_SOURCE_NAV = "The COA position of the offset account is lower than the change in NAV.";
const ESS_MSG_NEG_SHARES = "The number of shares can't be negative.";
const ERR_MSG_CLOSE_POSITION = "The asset position is closed and can't be updated.";
const ERR_MSG_PREV_NOT_SYNCED = "The previous update isn't synchronized with the blockchain, wait for sync.";
const ESS_MSG_OUTSTANDING_SHARES = "The position can't be closed because of outstanding shares.";
const ERR_MSG_OWNERSHIP_PERC = "The ownership percentage must be between 0 and 100.";
const ESS_MSG_CASH_NOT_FULLY_OWNED = "The cash asset must be fully owned (100%).";
const ERR_MSG_NAV_CANNOT_VALIDATE_NO_SUPPLY_NAV_IMPACT = "Can't validate NAV impact without a change in supply [code: A_Validate_01].";
const ERR_MSG_NO_TOKEN_ID = "The asset doesn't have a tokenId, and thus cannot be updated.";
const ERR_MSG_CREATE_NO_SOURCE_SUPPLY_CHANGING = "An asset created without an offset account must have a variable supply.";
const ERR_MSG_INCOMPATIBLE_WALLET = "Your wallet type can't manage assets.";
const ERR_MSG_CANNOT_MINT_DIRECT = "You don't have the right to mint directly.";
const ESS_MSG_CANNOT_REMOVE_SHARES = "Removing the transaction is not allowed, refresh the page."
const ERR_MSG_CANNOT_CREATE_ASSET_auth = "You are not allowed to create new assets."
const ERR_MSG_CANNOT_USE_SOURCE = "You are not allowed to use offset-account"
const ERR_MSG_MUST_USE_SOURCE_auth = "Operations not allowed, offset account must be selected."
const ERR_MSG_VARIABLE_SUPPLY_NA_auth = "No allowed. Cannot create variable supply asset."

const validateAssetOperation = async (asset, user, operation, assetType) => {
    await validateBasics(asset, user, operation, assetType)
    validateWallet(asset, user)
    await validatePolicy(asset, user, operation)
}

/**
 * Validate policy given by user roles.
 * @param asset 
 * @param user 
 * @param operation 
 */
async function validatePolicy(asset, user, operation) {
    
    // only distribution admins and supply managers can mint directly.
    if (asset.mintDirect && (!user.distributionRoles.includes(availableDistributionRoles.dist_admin) || !user.assetRoles.includes(availableAssetAccessRoles.supply_manager))) throw new Error(ERR_MSG_CANNOT_MINT_DIRECT)

    // only asset managers can create assets
    if (operation == OPERATION_CREATE && !user.assetRoles.includes(availableAssetAccessRoles.asset_manager))  throw new Error(ERR_MSG_CANNOT_CREATE_ASSET_auth)
    
    // only supply managers can create assets without source (aka offset account)
    if (!asset.sourceAsset && !user.assetRoles.includes(availableAssetAccessRoles.supply_manager)) throw new Error(ERR_MSG_MUST_USE_SOURCE_auth) 

    // user must enter valid secret before operations
    const authResp = await validateUserSecret(asset.userSignature, user.userSecret)
    if (process.env.ENVIRON == "production" && !authResp) throw new Error(ERR_MSG_USER_SECRET);// todo_must: remove first part (production check) after testing
    asset.userSignature = "signed by " + user.email

}

/**
 * Runs basic validation on the asset before allowing an operation.
 * Order of these checks in not enforced but recommended to run quick ones before and fail fast. 
 * @param asset 
 * @param user 
 * @param operation 
 * @param assetType 
 */
async function validateBasics(asset, user, operation, assetType) {
    if (operation == OPERATION_UPDATE) {
        if (!asset.syncedOnChain) throw new Error(ERR_MSG_PREV_NOT_SYNCED);
        if (!asset.tokenId) throw new Error(ERR_MSG_NO_TOKEN_ID)
    }

    if (typeof asset.expectedSupplyDelta != 'number') throw new Error(ERR_MSG_EXPECTED_SUPPLY_NAN)

    if (asset.ownershipPercentage < 0 || asset.ownershipPercentage > 100) throw new Error(ERR_MSG_OWNERSHIP_PERC);

    if (!isSupplyManager(user) && supplyCanChange(asset)) throw new Error(ERR_MSG_SUPPLY_ROLE);

    if (operation == OPERATION_CREATE && !asset.sourceAsset && !asset.supplyChanging) throw new Error(ERR_MSG_CREATE_NO_SOURCE_SUPPLY_CHANGING)
    if (variableSupplyNotAllowed(asset, assetType)) throw new Error(ERR_MSG_SUPPLY_CHANGING);

    const position = calculateAssetPosition(asset)
    if (position.nav < 0) throw new Error(ERR_MSG_NEG_NAV)

    const lastVersion = await getLastSyncedAssetVersion(asset.id)

    if (assetType.includes(AssetType.SHARE)) validateSharesAssetType(asset, lastVersion)
    else if (assetType.includes(AssetType.CASH) && asset.ownershipPercentage != 100) throw new Error(ESS_MSG_CASH_NOT_FULLY_OWNED)

    // was position closed
    if (lastVersion && lastVersion.closePosition) throw new Error(ERR_MSG_CLOSE_POSITION);

    // if sourceAsset is not an ID string, entire object has reached this hook and means most likely its coming from automatic localAPI calls and not from user. 
    if (operation != OPERATION_DELETE && asset.sourceAsset && typeof asset.sourceAsset == "string") await validateSourceAssetPosition(asset, lastVersion)

    const errMsg = await getValidateNoSupplyChangeNavError(asset, position, lastVersion)
    if (errMsg) throw new Error(errMsg);
}

// See if asset is waiting on active synchronization and if so, new transactions should be stopped.
// function isAssetPendingSync(asset, lastSyncedAsset) {
//     if (asset.syncedOnChain) return false   // asset actual is synced, proceed / PASS

//     // asset is not synced, see if this is first sync
//     if (!lastSyncedAsset) return false // no previous synced assets. This is first sync, proceed / PASS

//     // Asset was previously synced but current state is not. Stop execution to wait for current state to sync. 
//     return true
// }



function validateSharesAssetType(asset, lastVersion) {
    if (lastVersion.shares && asset.shares.length < lastVersion.shares.length) throw new Error(ESS_MSG_CANNOT_REMOVE_SHARES)
    if (assetSharesAreNegative(asset)) throw new Error(ESS_MSG_NEG_SHARES)
    if (closingPositionWithOutstandingShares(asset)) throw new Error(ESS_MSG_OUTSTANDING_SHARES)
}

function assetSharesAreNegative(asset) {
    let totalNrOfShares = 0
    asset.shares.forEach(share => {
        totalNrOfShares += share.nrOfParts
    });
    if (totalNrOfShares < 0) return true
    return false
}

function closingPositionWithOutstandingShares(asset) {
    if (!asset.closePosition) return false   //not closing, all good.

    let totalNrOfShares = 0
    asset.shares.forEach(share => {
        totalNrOfShares += share.nrOfParts
    });
    if (totalNrOfShares != 0) return true
    return false
}

/**
 * Source asset COA position must be enough to accomodate asset cashflow change.
 * @param asset 
 * @param cashflow 
 */
async function validateSourceAssetPosition(asset, lastVersion) {
    const position = calculateAssetPosition(asset)
    const relevantCashflow = await calculateAssetVersionCashflowChange(position.cashflow, { lastAssetV: lastVersion })

    const sourceAsset = await getLastSyncedAssetVersion(asset.sourceAsset)
    // then cashflow is negative thus COA change will be negative thus COA need to be higher than cahsflow
    if (relevantCashflow < 0 && sourceAsset.coa < Math.abs(relevantCashflow)) throw new Error(ERR_MSG_SOURCE_NAV)
}

async function getValidateNoSupplyChangeNavError(asset, position, lastVersion) {
    try {
        const totalNavData = await getTotalTreasuryNav();
        let totalNavChangePercentage
        const navImpactNoSupplyThresPercentage = await getNoSupplyChangeNavThreshold()
        console.log("validateNoSupplyChangeNavImpact | position.nav: ", position.nav)
        console.log("validateNoSupplyChangeNavImpact | navImpactNoSupplyThresPercentage: ", navImpactNoSupplyThresPercentage)

        // 1. Asset NAV change current asset, cashflow changes source asset.
        // when asset NAV delta is added to asset NAV and cashflow is added to source NAV, the total NAV treausry impact should be below threshold.  
        if (asset.sourceAsset) {
            const assetNavDelta = await calculateAssetVersionNavChange(position.nav, { lastAssetV: lastVersion })
            const cashflowDelta = await calculateAssetVersionCashflowChange(position.cashflow, { lastAssetV: lastVersion })
            console.log("validateNoSupplyChangeNavImpact | assetNavDelta: ", assetNavDelta)
            console.log("validateNoSupplyChangeNavImpact | cashflowDelta: ", cashflowDelta)
            const newNavAfter = totalNavData.real + assetNavDelta + cashflowDelta
            totalNavChangePercentage = ((newNavAfter - totalNavData.real) / totalNavData.real) * 100
            console.log("validateNoSupplyChangeNavImpact | newNavAfter: ", newNavAfter)
            console.log("validateNoSupplyChangeNavImpact | totalNavChangePerc: ", totalNavChangePercentage)
            if (totalNavChangePercentage > navImpactNoSupplyThresPercentage.threshold) return ERR_MSG_NAV_IMPACT
        }

        // 2.Asset has source or is supply changing, the NAV impact will not happen wo/ supply change.
        if (asset.sourceAsset || asset.supplyChanging) return "";

        // note: By here, asset will impact NAV as not source is selected and asset is not supply changing.
        // 3. Check the impact on NAV without supply change.
        const newNav = position.nav + totalNavData.real
        const impactPercentage = ((newNav - totalNavData.real) / totalNavData.real) * 100
        if (impactPercentage > navImpactNoSupplyThresPercentage.threshold) return ERR_MSG_NAV_IMPACT

    } catch (error) {
        console.log("validateNoSupplyChangeNavImpact > error [A_Validate_01]: ", error)
        return ERR_MSG_NAV_CANNOT_VALIDATE_NO_SUPPLY_NAV_IMPACT
    }
    return ""
}

function isSupplyManager(user) {
    if (user.assetRoles.includes(availableAssetAccessRoles.supply_manager)) return true
    else return false
}

function supplyCanChange(asset) {
    if (asset.sourceAsset || !asset.supplyChanging) return false
    return true
}

/**
 * If asset is set as "supply changing", its type must be cash.
 * @param asset 
 * @returns 
 */
function variableSupplyNotAllowed(asset, assetType) {
    if (assetType.includes(AssetType.CASH) || !asset.supplyChanging) return false // either CASH or not supply changing
    return true
}

function validateWallet(asset, user) {
    if (!user.wallet) throw new Error(ERR_MSG_NO_WALLET)
    if (user.wallet.provider !== WalletProvider.FIREBLOCKS) throw new Error(ERR_MSG_INCOMPATIBLE_WALLET)
    if (typeof user.wallet.externalVaultId === "undefined") throw new Error(ERR_MSG_INCOMPLETE_WALLET)
}

export { validateAssetOperation }
