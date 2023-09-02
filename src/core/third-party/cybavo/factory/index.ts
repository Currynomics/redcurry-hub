import { CybavoRequest, CybavoTransactionRequest } from "../model/CybavoTransactionRequest";

/**
 * Creates new TransactionRequest
 */
const createContractTransactionRequestForDelegate =({orderId, contractAddress, fromAddress, fromAddressIndex, contractAbi}): CybavoTransactionRequest => {
  const cybavoRequest: CybavoRequest = {
    order_id: orderId,
    address: contractAddress, // contract address interacting with
    amount: "0",
    contract_abi: contractAbi,
    user_id: "", // todo: replace with userId when we know what userId goes here (cybavo or our system)
    from_address: fromAddress,
    from_address_index: fromAddressIndex,
    ignore_gas_estimate_fail: false // todo: for debugging, turn true.
  }

  const requests: CybavoRequest[] = [cybavoRequest]
  const cybavoTransactionRequest: CybavoTransactionRequest = {
    requests: requests,
    ignore_black_list: true,
  }
  return cybavoTransactionRequest;
}

export { createContractTransactionRequestForDelegate }