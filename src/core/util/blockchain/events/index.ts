const { utils } = require('ethers');


const getAssetCreatedEventTopicHash = () => {
    const eventName = 'Transfer(address,address,uint256)';
    const eventSignatureHash = utils.id(eventName);

    console.log('Event signature hash:', eventSignatureHash);
}



/**
 * 
 *     event AssetCreated(
        uint256 indexed tokenId,
        address indexed creator,
        Types.Asset asset
    );
    event AssetUpdated(
        uint256 indexed tokenId,
        address indexed creator,
        Types.Asset asset
    );
    event AssetBurned(uint256 indexed tokenId, address indexed creator);
 */