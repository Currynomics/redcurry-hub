import { CollectionBeforeOperationHook } from 'payload/types';
import { encryptWalletSecret } from '../core/wallets/services/auth';

const OPERATION_CREATE = "create"
const OPERATION_UPDATE = "update"
const WALLET_SECRET_SET_KEYWORD = "secret stored"

const walletsBeforeOperationHookEncrypt: CollectionBeforeOperationHook = async ({
  args, // Original arguments passed into the operation
  operation, // name of the operation
}) => {
  if (operation == OPERATION_CREATE || operation == OPERATION_UPDATE) {

    if (!args.data) return args // nothing to encrypt

    // only encrypt when not encrypted already
    if (args.data.apiCode && !args.data.apiCode.includes(WALLET_SECRET_SET_KEYWORD)) {
      args.data.apiCode = await encryptWalletSecret(args.data.externalId, "apiCode", args.data.apiCode)
    }
    if (args.data.apiSecret && !args.data.apiSecret.includes(WALLET_SECRET_SET_KEYWORD)) {
      args.data.apiSecret = await encryptWalletSecret(args.data.externalId, "apiSecret", args.data.apiSecret)
    }
    if (args.data.apiRefreshToken && !args.data.apiRefreshToken.includes(WALLET_SECRET_SET_KEYWORD)) {
      args.data.apiRefreshToken = await encryptWalletSecret(args.data.externalId, "apiRefreshToken", args.data.apiRefreshToken)
    }
  }

  return args;
}



export default walletsBeforeOperationHookEncrypt;

