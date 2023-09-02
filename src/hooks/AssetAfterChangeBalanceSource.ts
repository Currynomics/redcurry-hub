import { CollectionAfterChangeHook } from 'payload/types';
import { tryBalanceSourceAsset } from '../core/assets/services/balancer';
import { reportIssue } from '../core/util/reporting';


const OPERATION_CREATE = "create"
const OPERATION_UPDATE = "update"

const assetAfterChangeBalanceSource: CollectionAfterChangeHook = async ({
  doc, // full document data
  req, // full express request
  previousDoc, // document data before updating the collection
  operation, // name of the operation ie. 'create', 'update'
}) => {
  // programmatic calls without user are ignored in hooks.
  if (!req.user) return doc

  // only worry about CU operations, ignore read ops, delete is not allowed by system
  if (operation == OPERATION_CREATE || operation == OPERATION_UPDATE) {
    // ignore when asset has no source
    if (!doc.sourceAsset) return doc

    // balance source asset
    const opResult = await tryBalanceSourceAsset(doc, operation)

    // warn if source wasn't balanced
    if (!opResult) reportIssue({ msg: "Source asset failed to balance [code: ]", level: "critical", code: "A_Hook_Source_01", trace: "tryBalanceSourceAsset()" })
  }
  return doc;
}


export default assetAfterChangeBalanceSource;

