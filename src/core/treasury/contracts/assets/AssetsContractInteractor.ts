const ethers = require("ethers")
import { AssetOC } from "../../../blockchain/asset/model/AssetOC";
import { reportIssue } from "../../../util/reporting";
import { getWeb3Provider } from '../w3Provider';
const abi = require("../../../../assets/artifacts/contracts/AssetsAbi.json");

const CONTRACT_ADR_ASSETS = process.env.CONTRACT_ADR_ASSETS

export class AssetsContractInteractor {
    static instance;
    provider: any;
    contract: any;

    private constructor() {}

    static async createInstance() {
        const interactor = new AssetsContractInteractor();
        await interactor.init();
        return interactor;
    }

    async init() {
        try {
            this.provider = await getWeb3Provider()
            this.contract = new ethers.Contract(CONTRACT_ADR_ASSETS, abi, this.provider.getSigner())
        } catch (error) {
            console.error("AssetsContractInteractor.init() > error: ", error);
            reportIssue({
                msg: "Failed to initiate AssetsContractInteractor",
                level: "critical",
                code: "B_ContractInteractor_Assets",
                trace: "AssetsContractInteractor.init(). Error: " + error.message,
            });
        }
    }

    async getAssets() {
        return await this.contract.assets()
    }

    async getAsset(tokenId) {
        return await this.contract.get(tokenId)
    }


    async count() {
        return await this.contract.count()
    }

}
