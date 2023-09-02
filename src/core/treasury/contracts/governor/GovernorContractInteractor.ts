const ethers = require("ethers")
import { AssetOC } from "../../../blockchain/asset/model/AssetOC";
import { reportIssue } from "../../../util/reporting";
import { getWeb3Provider } from '../w3Provider';
const govContractAbi = require("../../../../assets/artifacts/contracts/GovAbi.json");

const GOV_CONTRACT_ADR = process.env.CONTRACT_ADR_GOVERNOR

export class GovernorContractInteractor {
    static instance;
    provider: any;
    govContract: any;

    private constructor() {
        // Todo: use singletone pattern when you learn how to change eip provider txn id dynamically.
        // if (GovernorContractInteractor.instance) return GovernorContractInteractor.instance;
        // GovernorContractInteractor.instance = this;
        // return GovernorContractInteractor.instance
    }

    static async createInstance(vaultId?: string, externalTxnId?: string) {
        const interactor = new GovernorContractInteractor();
        await interactor.init(vaultId, externalTxnId);
        return interactor;
    }

    async init(vaultId?: string, externalTxnId?: string) {
        try {
            this.provider = await getWeb3Provider(vaultId, externalTxnId);
            this.govContract = new ethers.Contract(GOV_CONTRACT_ADR, govContractAbi, this.provider.getSigner());
        } catch (error) {
            console.error("GovernorContractInteractor.init() > error: ", error);
            reportIssue({
                msg: "Failed to initiate GovernorContractInteractor",
                level: "critical",
                code: "B_ContractInteractor_Governor",
                trace: "GovernorContractInteractor.init(). Error: " + error.message,
            });
        }
    }

    async getNAPT() {
        return await this.govContract.getNAPT()
    }

    async totalPosition() {
        return await this.govContract.totalPosition()
    }

    async getNoSupplyChangeNavThreshold() {
        return await this.govContract.noSupplyChangeNavThreshold()
    }

    async create(asset: AssetOC, expectedTokens, recipient) {
        const tx = await this._executeMethod(this.govContract.create, asset, expectedTokens, recipient);
        return tx;
    }

    async createUsingSource(asset: AssetOC, cashflow, sourceId) {
        const tx = await this._executeMethod(this.govContract.createUsingSource, asset, cashflow, sourceId);
        return tx;
    }

    async update(asset: AssetOC, tokens, recipient) {
        const tx = await this._executeMethod(this.govContract.update, asset, tokens, recipient);
        return tx;
    }

    async updateUsingSource(asset: AssetOC, cashflow, sourceId) {
        console.log("GovInteractor | updateUsingSource: ", asset, cashflow, sourceId)
        const tx = await this._executeMethod(this.govContract.updateUsingSource, asset, cashflow, sourceId);
        return tx;
    }

    async burn(tokenId, tokens) {
        const tx = await this._executeMethod(this.govContract.burn, tokenId, tokens);
        return tx;
    }

    async burnUsingSource(tokenId, cashflow, sourceId) {
        const tx = await this._executeMethod(this.govContract.burnUsingSource, tokenId, cashflow, sourceId);
        return tx;
    }

    async _executeMethod(method, ...args) {
        try {
            const tx = await method(...args);
            //this._logTransaction(tx);
            return tx;
        } catch (error) {
            console.log(`${method.name} > error: `, error);
        }
    }

    _logTransaction(tx) {
        console.log(JSON.stringify(tx, null, 2));
    }
}
