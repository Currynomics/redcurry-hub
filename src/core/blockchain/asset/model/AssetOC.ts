enum AssetStatus {
    ACTIVE,
    REMOVED,
    PENDING_REMOVAL,
    PENDING_ACTIVATION,
}

enum AssetType {
    CASH,
    PROPERTY,
    SHARE,
    EQUITY,
    CONSOLIDATION,
    OTHER,
}

enum AssetSubType {
    FIAT,
    STABLECOIN,
    COMMERCIAL,
    RESIDENTIAL,
    LOW_EXPOSURE,
    MID_EXPOSURE,
    HIGH_EXPOSURE,
    PROPERTY_TOKEN,
    CRYPTO,
    OTHER
}

enum OwnershipType {
    DIRECT,
    SHARES,
    OTHER
}

enum Currency {
    EUR
}


interface Value {
    currency: Currency;
    oav: BigInt;
    coa: BigInt;
    ral: BigInt;
    oa: BigInt;
    oavi: BigInt;
    oavr: BigInt;
    bd: BigInt;
    oi: number; // ‱
}

interface AssetOC {
    tokenId: number;
    sourceId: number;
    creator: string;            
    managers: Array<string>;    
    supplyChanging: boolean;
    value: Value;
    assetType: AssetType;
    owner: string;
    assetSubType: AssetSubType;
    name: string;
    status: AssetStatus;
    ownershipType: OwnershipType;
    lastAuditedAt: number,
    externalId: string;
}

export { OwnershipType, AssetOC, Value, Currency, AssetType, AssetStatus, AssetSubType };