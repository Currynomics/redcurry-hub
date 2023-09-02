/*
to get TotalNav - Gover - method totalPosition
to get Total assets - Assets - method count
to get Total supply - Token - method totalSupply
to get NAPT - Gover - method getNAPT
*/
export abstract class ContractService {
    contract: any;
    provider: any;
    network: any;
    gasLimit: any;
    contractAdr: string;

    constructor(contractAdr: string, network: string, gasLimit: string) {
        console.log("ContractService | constructor: ", contractAdr, network, gasLimit)
        this.contractAdr = contractAdr;
        this.network = network;
        this.gasLimit = gasLimit;
    }

    getContractAddress() {
        return this.contractAdr;
    }

    async getOwner() {
        if (!this.contract) throw Error("Contract not initiated")
        const owner = await this.contract.owner();
        return owner;
    }

    async ownerOf(tokenId: number) {
        if (!this.contract) throw Error("Contract not initiated")
        return await this.contract.ownerOf(tokenId)
    }
}
