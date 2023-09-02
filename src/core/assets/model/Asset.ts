import AssetSubType from "./enums/AssetSubType";
import AssetType from "./enums/AssetType";
import AValuation from "./AValuation";
import OnChainData from "./OnChainData";
import Ownership from "./Ownership";

class Asset {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    location: string;
    type: AssetType;
    subType: AssetSubType;
    custodian: string;
    createdOn: Date;
    updatedOn: Date;
    valuation: AValuation;
    ownership: Ownership;
    onChainData: OnChainData;
    constructor() {}
}

export default Asset