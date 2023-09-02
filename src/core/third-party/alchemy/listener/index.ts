import { Network, Alchemy } from 'alchemy-sdk';

export default class AlchemyListener {
    alchemy: any
    topic1: string
    topic2: string
    zeroTopic: string
    assetsContractAddress: string
    assetMintEvents: any
    network: any
    constructor() {
        this.network = process.env.ENVIRON === 'local' || process.env.ENVIRON === 'staging' ? Network.MATIC_MUMBAI : Network.MATIC_MAINNET;

        // Setup
        const config = {
            apiKey: process.env.ALCHEMY_API_KEY,
            network: this.network,
        };
        this.alchemy = new Alchemy(config);

        // todo: understand which topic is mint.
        this.topic1 = '0xba52f4c4f97fab0c4550ddee240f74456c645394179e8a94dd78c5022f6c3804';
        this.zeroTopic = '0x0000000000000000000000000000000000000000000000000000000000000004';
        this.topic2 = '0x00000000000000000000000050bef9b58dc9d9083272a2d850e4f97cb691d3ff';
        this.assetsContractAddress = process.env.CONTRACT_ADR_ASSETS;

        // Create the log options object.
        this.assetMintEvents = {
            address: this.assetsContractAddress,
            topics: [this.topic1, this.topic2, this.zeroTopic],
        };

        console.log(' ### ALCHEMY | opening websocket ###');
        // Open the websocket and listen for events!
        this.alchemy.ws.on(this.assetMintEvents, this.newEvent);
    }

    // TODO: Add whatever logic you want to run upon mint events.
    newEvent(txn) {
        console.log('alchemy listened | newEvent > txn: ', txn);
    }
}

