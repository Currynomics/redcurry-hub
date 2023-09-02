import { ethers } from 'ethers'


export class ContractInteractor {
    network: string;
    contractAbi: any;
    contractAdr: string;
    provider: any;
    signer: any;
    contract: any;

    constructor(network: string, contractAbi: any, contractAdr: string, apiKey: string) {
        try {
            this.network = network
            this.contractAbi = contractAbi;
            this.contractAdr =contractAdr;
            this.provider = new ethers.providers.AlchemyProvider(network=network, apiKey);
        } catch (error) {
            console.log("constructor | error:", error)
            throw Error("ContractInteractor constructor failed. Error: ", error)
        }

    }

    // sets the contract to readonly and returns the contract.
    setContractToReadOnly(){
        this.contract = new ethers.Contract(this.contractAdr, this.contractAbi, this.provider);
        return this.contract
    }

    // sets the contract to be able to write and retruns the contract.
    setContractToWrite(walletPKey: string){
        this.signer = new ethers.Wallet(walletPKey, this.provider);
        this.contract = new ethers.Contract(this.contractAdr, this.contractAbi, this.signer);
        return this.contract
    }

    getContract() {
        if(this.contract) return this.contract;
        throw new Error("Contract not initiated. Call setContractToReadOnly() or setContractToWrite() first.")
    }

    getProvider() {
        return this.provider;
    }
}