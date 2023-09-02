import OwnershipType from "./enums/OwnershipType";

class Ownership {
    ownershipType: OwnershipType;
    immediateOwner: string;
    ultimateOwner: string;
    quantityOwned: number;
    totalQuantity: number;
    lastAudit: Date;
    offChainReferenceUrl: string;

    constructor() {

    }
}



export default Ownership;