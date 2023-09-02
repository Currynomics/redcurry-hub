import { PeerType, TransactionOperation } from "fireblocks-sdk";
import fs from "fs";
import { FireblocksSDK } from "fireblocks-sdk";
import { reportIssue } from "../../../util/reporting";
require('dotenv').config();

let client: FireblocksClient
const getFireblocksClient = () => {
  try {
    if (!client) client = new FireblocksClient()
    return client
  } catch (error) {
    reportIssue({ msg: "Failed to create fireblock client", level: "critical", code: "B_Fireblocks_01", trace: "getFireblocksClient() | new FireblocksClient(). Error: " + error.message })
    console.log("getFireblocksClient > error: ", error)
    return "Cannot get fireblocks client. error msg [B_Fireblocks_01]: " + error.message
  }
}

// docs: https://www.npmjs.com/package/fireblocks-sdk
// docs: https://docs.fireblocks.com/api/swagger-ui/
// docs: https://developers.fireblocks.com/reference/contracts
class FireblocksClient {
  private apiSecret: string;
  private apiKey: string;
  // private baseUrl: string;
  private ASSET_ID: string = process.env.FB_MATIC_ASSET_ID; // The asset type should always be the base asset of the relevant EVM-compatible blockchain.
  private fireblocks: FireblocksSDK;

  constructor() {
    this.apiSecret = fs.readFileSync(process.env.FB_USER_RED_SIGNER_1_SECRET_PATH!, "utf8");
    this.apiKey = process.env.FB_USER_RED_SIGNER_1_API_KEY!;

    if (this.apiSecret && this.apiKey) this.fireblocks = new FireblocksSDK(this.apiSecret, this.apiKey);
    else throw new Error("FireblocksClient | cannot declare arguments.")
  }


  async getAccountDetails() {
    try {
      const fbResp = await this.fireblocks.getVaultAccountsWithPageInfo({});
      return fbResp;
    } catch (error) {
      console.log("getAccountDetails > error: ", error.message);
      return false;
    }
  }

  async getWhitelistedContracts() {
    try {
      const fbResp = await this.fireblocks.getContractWallets();
      return fbResp;
    } catch (error) {
      console.log("getAccountDetails > error: ", error.message);
      return false;
    }
  }


  // docs: https://support.fireblocks.io/hc/en-us/articles/360017709160-Fireblocks-Smart-Contract-DeFi-API
  // docs: https://developers.fireblocks.com/reference/post_transactions
  async createContractCallTransaction(
    contractCallData: string,
    vaultAccountId: string,
    eventId: string,
    whitelistedContractId: string,
    note?: string,
  ) {
    try {
      const transactionRequest = {
        operation: TransactionOperation.CONTRACT_CALL,
        assetId: this.ASSET_ID,
        source: {
          type: PeerType.VAULT_ACCOUNT,
          id: vaultAccountId /* Source Vault Account ID */,
        },
        destination: {
          type: PeerType.EXTERNAL_WALLET, // in case of using whitelist a contract address 
          id: whitelistedContractId
        },
        note: note || "Contract call from redcurry backoffice",
        amount: "0",
        extraParameters: {
          contractCallData: contractCallData /* Data Payload */,
        },
        externalTxId: eventId
      }
      console.log("createContractCallTransaction | transactionRequest: ", transactionRequest)
      const response = await this.fireblocks.createTransaction(transactionRequest);
      console.log("createContractCallTransaction > response: ", response);
      return response
    } catch (error) {
      console.log("createContractCallTransaction > error: ", error);
      return false;
    }
  }
}

export { FireblocksClient, getFireblocksClient };
