const ethers = require("ethers")
import { reportIssue } from "../../../util/reporting";
import { getWeb3Provider } from '../w3Provider';
const abi = require("../../../../assets/artifacts/contracts/RedTokenAbi.json");
const CONTRACT_ADR_RED_TOKEN = process.env.CONTRACT_ADR_RED_TOKEN

export class TokenContractInteractor {
    static instance;
    provider: any;
    contract: any;

    private constructor() {
        // if (TokenContractInteractor.instance) return TokenContractInteractor.instance;
        // TokenContractInteractor.instance = this;
        // return TokenContractInteractor.instance
    }

    static async createInstance() {
        const interactor = new TokenContractInteractor();
        await interactor.init();
        return interactor;
    }

    async init() {
        try {
            this.provider = await getWeb3Provider()
            this.contract = new ethers.Contract(CONTRACT_ADR_RED_TOKEN, abi, this.provider.getSigner())
        } catch (error) {
            console.error("TokenContractInteractor.init() > error: ", error);
            reportIssue({
                msg: "Failed to initiate TokenContractInteractor",
                level: "critical",
                code: "B_ContractInteractor_Token",
                trace: "TokenContractInteractor.init(). Error: " + error.message,
            });
        }
    }

    async getSupply() {
        return await this.contract.totalSupply()
    }

    async getEscrow() {
        return await this.contract.getEscrow()
    }

}
