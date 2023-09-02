import { dencodeAbi } from "../../../third-party/ethers/ethersService";
import { abiEncode } from "../../encoder";
import { AssetOC } from "../model/AssetOC";
import { AssetPublishCommand } from "../model/AssetPublishCommand";

/*
    // Encoding complex structs (using positional properties)
    abiCoder.encode(
    [ "uint", "tuple(uint256, string)" ],
    [
        1234,
        [ 5678, "Hello World" ]
    ]
    );
*/

// docs: https://docs.ethers.org/v5/api/utils/abi/coder/
// helper: https://calldata-decoder.apoorv.xyz/
const createContractCallDataAbiEncoded = (asset: AssetOC, expectedSupplyDelta: number) => {
    try {
        // const map = ["tuple(tokenId, sourceId, creator, managers, supplyChanging, Value(currency, oav, coa, ral, oa, oavi, oavr, bd, oi), AssetTypeEnum, owner, AssetSubTypeEnum, name, AssetStatusEnum, OwnershipTypeEnum, wasAuditedOn, externalId)", "expectedSupplyChange"]

        // todo: fix this
        const types = ["tuple(uint256, uint256, address, address[], bool, tuple(uint8, uint256, uint256, int256, uint256, uint256, uint256, uint256, uint16), uint8, address, uint8, string, uint8, uint8, uint256, string)", "uint256"]
        const values = [
            [
                asset.tokenId,
                asset.sourceId,
                asset.creator,
                asset.managers,
                asset.supplyChanging,
                [
                    asset.value.currency,
                    asset.value.oav,
                    asset.value.coa,
                    asset.value.ral,
                    asset.value.oa,
                    asset.value.oavi,
                    asset.value.oavr,
                    asset.value.bd,
                    asset.value.oi,
                ],
                asset.assetType,
                asset.owner,
                asset.assetSubType,
                asset.name,
                asset.status,
                asset.ownershipType,
                asset.lastAuditedAt,
                asset.externalId
            ],
            expectedSupplyDelta
        ]

        // const encoded = abiEncode(types, values)
        const encoded = abiEncode(types, values)

        console.log("test | abi decoded: ", dencodeAbi(types, encoded))
        return encoded
    } catch (error) {
        console.error("createContractCallDataAbiEncoded | error: ", error)
        throw new Error(error.message)
    }
}
export { createContractCallDataAbiEncoded }