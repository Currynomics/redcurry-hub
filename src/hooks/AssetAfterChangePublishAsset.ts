import { CollectionAfterChangeHook } from 'payload/types';
// import { resetAssetOnChainSync } from '../core/assets/services';
import { AssetPublishCommand } from '../core/blockchain/asset/model/AssetPublishCommand';
import { processAndPublishAsset } from '../core/blockchain/asset/publisher';
import { tryRestoreToPreviousSyncedVersionNoUser } from '../core/assets/repositories/versions';
import { reportIssue } from '../core/util/reporting';
import { setMessage } from '../frontHelpers/state/notifications';
import { checkAddress } from '../core/third-party/ethers/ethersService';
import { availableAssetAccessRoles } from '../assets/constants/assetAccessRoles';
import { deleteCollectionItem } from '../core/payload/localApi';

// const CASCADE_OFF_STATUS = 0;
const ERR_MSG_NO_WALLET = "User has no wallet assigned."
const ERR_MSG_NO_WALLET_VAULT_ID = "User wallet has no vault id set."
const ERR_MSG_EXPECTED_SUPPLY_WRONG = "Excpected supply delta must be a number."
const ERR_MSG_FALSE_WALLET = "Attempting to transform non standard address as a manager."
const ERR_MSG_NO_ASSET_TITLE = "Asset title is undefined."
const ERR_MSG_SUPPLY_CHANGE_UNDEFINED = "Asset supply changing is not specified."
const ERR_MSG_CANNOT_USE_SOURCE = "User is not allowed to use offset-account"
const ERR_MSG_PUBLISH_FAILED = "Failed to publish, asset restored to previos version. Refresh page."

const assetAfterChangePublishAsset: CollectionAfterChangeHook = async ({
  doc, // full document data
  req, // full express request
  previousDoc, // document data before updating the collection
  operation, // name of the operation ie. 'create', 'update'
}) => {
  // programmatic calls without user are ignored in hooks. 
  if (!req.user) return doc

  const publishCommand = createValidAssetPublishCommand(doc, operation, req.user)
  const tx = await processAndPublishAsset(publishCommand)
  if (!tx) {
    console.error("Publish has failed, restoring to previous synced version.")

    const lastVersion = await tryRestoreToPreviousSyncedVersionNoUser(publishCommand.asset.id)

    reportIssue({
      msg: "Failed to publish on-chain.",
      level: "critical",
      code: "B_Publisher_02",
      trace: "processAndPublishAsset() after max retires, wasnt successful. Off-chain version restored to previous sync.",
    });

    if (!lastVersion) {
      //there was no previous version, deleting the document completely to start again
      await deleteCollectionItem("assets", doc.id)
    }
    throw new Error(ERR_MSG_PUBLISH_FAILED) // todo: check if this is called, previousDoc is called not the current doc (unpublished)
    // if(previousDoc) return previousDoc
    // else 
  }

  return doc;
}


function createValidAssetPublishCommand(doc, operation, user): AssetPublishCommand {
  const command: AssetPublishCommand = {
    asset: doc,
    operation: operation,
    user: user,
    eventId: doc.eventId,
    expectedSupplyDelta: doc.expectedSupplyDelta,
  }

  if (typeof command.expectedSupplyDelta != 'number') throw new Error(ERR_MSG_EXPECTED_SUPPLY_WRONG)
  if (!command.user.wallet) throw new Error(ERR_MSG_NO_WALLET)
  if (typeof command.user.wallet.externalVaultId === "undefined") throw new Error(ERR_MSG_NO_WALLET_VAULT_ID)
  if (!command.user.wallet || !command.user.wallet.address) throw new Error(ERR_MSG_NO_WALLET)
  if (!checkAddress(command.user.wallet.address)) throw new Error(ERR_MSG_FALSE_WALLET)
  if (typeof command.asset.supplyChanging == "undefined") throw new Error(ERR_MSG_SUPPLY_CHANGE_UNDEFINED)
  if (!command.asset.title) throw new Error(ERR_MSG_NO_ASSET_TITLE)
  if (command.asset.sourceAsset && !command.user.assetRoles.includes(availableAssetAccessRoles.asset_manager)) throw new Error(ERR_MSG_CANNOT_USE_SOURCE)

  return command

}



export default assetAfterChangePublishAsset;

