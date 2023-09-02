import { ContractInteractor } from "../../../third-party/alchemy/ContractInteractor";
import { ContractService } from "../ContractService";
const contractAbi = require("../../../../assets/artifacts/contracts/GovAbi.json");

/**
 * DEPRECATION WARNING!
 */
export class GovContractService extends ContractService {
    constructor() {
        let network, gasLimit
        if (process.env.PAYLOAD_PUBLIC_ENVIRON == 'local' || process.env.PAYLOAD_PUBLIC_ENVIRON == 'staging') {
            gasLimit = process.env.MUMBAI_GAS_LIMIT
            network = "maticmum"
        } else if(process.env.PAYLOAD_PUBLIC_ENVIRON == 'production') {
            gasLimit = process.env.POLYGON_GAS_LIMIT
            network = "matic"
        }


        super(process.env.PAYLOAD_PUBLIC_CONTRACT_ADR_GOVERNOR, network, gasLimit );

        const ci = new ContractInteractor(this.network, contractAbi, this.contractAdr, process.env.ALCHEMY_API_KEY);
        this.contract = ci.setContractToReadOnly();
    }

    async getTotalPosition() {
        if (!this.contract) throw Error("Contract not initiated")
        return await this.contract.totalPosition();
    }

    async getNAPT() {
        if (!this.contract) throw Error("Contract not initiated")
        return await this.contract.getNAPT();
    }
}

