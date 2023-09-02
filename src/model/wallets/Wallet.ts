class Wallet {
    address: string;
    blockchain?: Blockchain;
    environment: Environment;
    externalId: string;
    tags: string;
    assignedUserName: string;
    assignedUserRole: string;
    name: string;
    assignedCompanyName: string;


    constructor(address: string, externalId?: string, environment?: Environment, blockchain?: Blockchain, tags?: string) {
        this.address = address;
        this.blockchain = blockchain;
        this.environment = environment;
        this.externalId = externalId;
        this.tags = tags;
    }
}

enum Environment {
    PRODUCTION,
    STAGING,
    TESTING,
}

enum Blockchain {
    POLYGON,
    ETHEREUM,
    MOONBEAM,
    VELAS,
}

export default Wallet