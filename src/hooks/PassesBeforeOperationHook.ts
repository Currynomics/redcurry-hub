import { CollectionBeforeOperationHook } from 'payload/types';
import { validateUserSecret } from '../core/users/userService';
import { getContactWalletAddress } from '../core/contacts/contactService';

const OPERATION_CREATE = "create"
const OPERATION_DELETE = "delete"
const OPERATION_UPDATE = "update"

const passesBeforeOperationHook: CollectionBeforeOperationHook = async ({
  args, // Original arguments passed into the operation
  operation, // name of the operation
}) => {
  if (operation == OPERATION_CREATE) {
    const walletAddress = await getContactWalletAddress(args.data.recipient)
    if(!walletAddress)throw new Error("Recipient doesn't have wallet address");
    const result = await validateUserSecret(args.data.userSignature, args.req.user.userSecret)
    if (!result) throw new Error("Invalid user secret");
    else args.data.userSignature = "signed by " + args.req.user.email
  }
  return args; // Return operation arguments as necessary
}

export default passesBeforeOperationHook;

