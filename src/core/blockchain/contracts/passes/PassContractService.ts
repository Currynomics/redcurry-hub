import Pass from "../../../../model/passes/Pass";
import { ContractInteractor } from "../../../third-party/alchemy/ContractInteractor";
import { ContractService } from "../ContractService";
const contractAbi = require("../../../../assets/artifacts/contracts/RedMemberABI.json");
const GAS_PRICE_MODIFIER = 1.2 // increase by 20%

export class PassContractService extends ContractService {
    constructor() {
        super(
            process.env.CONTRACT_ADR_RED_MEMBER,
            process.env.ENVIRON === 'local' || process.env.ENVIRON === 'staging' ? "maticmum" : "matic",
            process.env.ENVIRON === 'local' || process.env.ENVIRON === 'staging' ? process.env.MUMBAI_GAS_LIMIT : process.env.POLYGON_GAS_LIMIT,
        );

        const ci = new ContractInteractor(this.network, contractAbi, this.contractAdr, process.env.ALCHEMY_API_KEY);
        this.contract = ci.setContractToWrite(process.env.WALLET_PRIVATE_KEY);
        this.provider = ci.getProvider();
    }

    async mintPass(pass: Pass) {
        if (!this.contract) throw Error("Contract not initiated")

        const feeData = await this.provider.getFeeData()
        const gasP = feeData.gasPrice * GAS_PRICE_MODIFIER // increase price to make transaction go through faster.
        const gasPBig = BigInt(Math.round(gasP)) // to avoid underflow error, convert to BitInt

        const gasConfig = {
            gasLimit: this.gasLimit,
            gasPrice: gasPBig,
            nonce: undefined,
        }

        const tx = await this.contract.createPass(
            pass.id,
            pass.title,
            pass.description,
            pass.typeCode,
            pass.owner,
            pass.imgUrl,
            pass.passSignature,
            gasConfig
        );
        tx.wait();
        return tx.hash;
    }

    async getPassTokenId(passOffchainId: string) {
        return await this.contract.getTokenId(passOffchainId);
    }
}
