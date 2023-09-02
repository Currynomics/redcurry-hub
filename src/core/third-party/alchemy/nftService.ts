import { Alchemy, Network, AlchemySubscription } from "alchemy-sdk";

var network;
if (process.env.ENVIRON === 'local' || process.env.ENVIRON === 'staging') network = Network.MATIC_MUMBAI
else network = Network.MATIC_MAINNET

const omitMetadata = false;

// Setup
const config = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: network,
};
const alchemy = new Alchemy(config);


const getNftsForContract = async (contractAddress) => {
    try {
        // Get all NFTs
        const response = await alchemy.nft.getNftsForContract(contractAddress, {
            omitMetadata: omitMetadata,
        });
        return response;
    } catch (error) {
        console.error("alchemy | nftService.getNftsForContract | error: ", error.message)
        throw error;
    }
}

const getNftMetadata = async (contractAddress, tokenId) => {
    try {
        const response = await alchemy.nft.getNftMetadata(contractAddress, tokenId)
        return response;
    } catch (error) {
        console.error("alchemy | nftService.getNftMetadata | error: ", error.message)
        throw error;
    }
}

const startNewBlockSocket = () => {

    // // Get all outbound transfers for a provided address
    // alchemy.core
    //     .getTokenBalances('0x994b342dd87fc825f66e51ffa3ef71ad818b6893')
    //     .then(console.log);

    // // Get all the NFTs owned by an address
    // const nfts = alchemy.nft.getNftsForOwner("0xshah.eth");

    // Listen to all new pending transactions
    
    alchemy.ws.on(
        {
            method: AlchemySubscription.PENDING_TRANSACTIONS,
            fromAddress: "0x24A87513B3B4C6f7290010c741222e3Ae8F764b0"
        },
        (res) => console.log(res)
    );

}
const startMinedTransactionSocket = async () => {
    try {
        console.log("WS / alchemy | nftService.startMinedTransactionSocket | starting...")
        // Subscription for Alchemy's Mined Transactions  API
        alchemy.ws.on(
            {
                method: AlchemySubscription.MINED_TRANSACTIONS,
                addresses: [
                    {
                        from: "0x473780deaf4a2ac070bbba936b0cdefe7f267dfc",
                        to: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                    },
                    {
                        to: "0x473780deaf4a2ac070bbba936b0cdefe7f267dfc",
                    },
                ],
                includeRemoved: true,
                hashesOnly: false,
            },
            (tx) => console.log(tx)
        );
    } catch (error) {
        console.error("alchemy | nftService.startMinedTransactionSocket | error: ", error.message)
    }

}





export { getNftsForContract, getNftMetadata, startMinedTransactionSocket, startNewBlockSocket };