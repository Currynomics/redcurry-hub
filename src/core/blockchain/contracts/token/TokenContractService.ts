import { ContractInteractor } from "../../../third-party/alchemy/ContractInteractor";
import { ContractService } from "../ContractService";
const contractAbi = require("../../../../assets/artifacts/contracts/RedTokenAbi.json");

/**
 * DEPRECATION WARNING! (All moved to ContractInteractor)
 */
export class TokenContractService extends ContractService {
    constructor() {
        super(
            process.env.CONTRACT_ADR_RED_TOKEN,
            process.env.ENVIRON === 'local' || process.env.ENVIRON === 'staging' ? "maticmum" : "matic",
            process.env.ENVIRON === 'local' || process.env.ENVIRON === 'staging' ? process.env.MUMBAI_GAS_LIMIT : process.env.POLYGON_GAS_LIMIT,
        );

        const ci = new ContractInteractor(this.network, contractAbi, this.contractAdr, process.env.ALCHEMY_API_KEY);
        this.contract = ci.setContractToReadOnly();
    }

    async getTotalSupply() {
        if (!this.contract) throw Error("Contract not initiated")
        return await this.contract.totalSupply();
    }
}

