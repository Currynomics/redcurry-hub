import Blockchain from "./enums/Blockchain";

class OnChainData {
    contractAddress: string;
    tokenId: string;
    tokenType: string;
    createdByAddress: string;
    updatedByAddress: string;
    blockchain: Blockchain;

    constructor() {

    }
}
export default OnChainData;