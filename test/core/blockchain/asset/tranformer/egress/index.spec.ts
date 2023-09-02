import { expect } from "chai";
import sinon from "sinon";
import { BigNumber } from "ethers";
import OwnershipType from "../../../../../../src/core/assets/model/enums/OwnershipType";
import { AssetPublishCommand } from "../../../../../../src/core/blockchain/asset/model/AssetPublishCommand";

import * as findCollectionItemById from "../../../../../../src/core/payload/localApi";
import * as checkAddress from "../../../../../../src/core/third-party/ethers/ethersService";
import * as calculateAssetPosition from "../../../../../../src/core/assets/services/calculations";

import { transform } from "../../../../../../src/core/blockchain/asset/transformer/egress";

describe("transform asset publish request to assetOc -> transform()", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("should return valid AssetOC object with valid input", async () => {
        const fakeAssetType = {
            type: "cash",
            subType: "fiat",
        };
        const fakeAsset = {
            id: "1",
            assetType: "cash_fiat",
            ownerhipType: OwnershipType.DIRECT,
            shares: [],
            supplyChanging: false,
            title: "fake asset"
        };
        const fakeCreatingUser = {
            wallet: {
                address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        };
        const AssetPublishCommand: AssetPublishCommand = {
            asset: fakeAsset,
            creatingUser: fakeCreatingUser,
            operation: "create",
            eventId: "event_id_fak_not_tested",
            expectedSupplyDelta: 1222,
        };
        sinon.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
        sinon.stub(checkAddress, "checkAddress").returns(true);
        sinon.stub(calculateAssetPosition, "calculateAssetPosition").returns({
            osta: 0,
            rec: 0,
            lia: 0,
            coa: 0,
            oav: 0,
            olta: 0,
            oavi: 0,
            oavr: 0,
            cashflow: 0,
        });

        const result = await transform(AssetPublishCommand);
        expect(result).to.be.an("object");
        expect(result.tokenId).to.equal(0);
        expect(result.sourceId).to.equal(0);
        expect(result.creator).to.equal("0x0000000000000000000000000000000000000000");
        expect(result.managers).to.have.lengthOf(1);
        expect(result.managers[0]).to.equal("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
        expect(result.value.currency).to.equal(0); // 0 equal EUR enum on-chain
        expect(result.assetType).to.equal(0);
        expect(result.assetSubType).to.equal(0);
        expect(result.owner).to.equal("0x0000000000000000000000000000000000000000");
        expect(result.name).to.be.undefined;
        expect(result.status).to.equal(0);
        expect(result.qtyOwned).to.equal("");
        expect(result.ownershipType).to.equal(0);
        expect(result.lastAuditedAt).to.equal(0);
        expect(result.externalId).to.equal("1");
        expect(result.supplyChanging).to.equal(false);
    });

    it("should return valid AssetOC object with valid input 2", async () => {
        const fakeAssetType = {
            type: "share",
            subType: "low",
        };
        const fakeAsset = {
            id: "1",
            assetType: "share_low",
            ownerhipType: OwnershipType.DIRECT,
            shares: [],
            supplyChanging: true,
            title: "fake asset"
        };
        const fakeCreatingUser = {
            wallet: {
                address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        };
        const AssetPublishCommand: AssetPublishCommand = {
            asset: fakeAsset,
            creatingUser: fakeCreatingUser,
            operation: "create",
            eventId: "event_id_fak_not_tested",
            expectedSupplyDelta: 1222,
        };
        sinon.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
        sinon.stub(checkAddress, "checkAddress").returns(true);
        sinon.stub(calculateAssetPosition, "calculateAssetPosition").returns({
            osta: 0,
            rec: 0,
            lia: 0,
            coa: 0,
            oav: 0,
            olta: 0,
            oavi: 0,
            oavr: 0,
            cashflow: 0,
        });

        const result = await transform(AssetPublishCommand);

        expect(result).to.be.an("object");
        expect(result.tokenId).to.equal(0);
        expect(result.sourceId).to.equal(0);
        expect(result.creator).to.equal("0x0000000000000000000000000000000000000000");
        expect(result.managers).to.have.lengthOf(1);
        expect(result.managers[0]).to.equal("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
        expect(result.value.currency).to.equal(0); // 0 equal EUR enum on-chain
        expect(result.assetType).to.equal(2);
        expect(result.assetSubType).to.equal(4);
        expect(result.owner).to.equal("0x0000000000000000000000000000000000000000");
        expect(result.name).to.be.undefined;
        expect(result.status).to.equal(0);
        expect(result.qtyOwned).to.equal("");
        expect(result.ownershipType).to.equal(0);
        expect(result.lastAuditedAt).to.equal(0);
        expect(result.externalId).to.equal("1");
        expect(result.supplyChanging).to.equal(true);
    });


    it("should throw an error if creating user has no wallet address", async () => {
        const fakeAsset = {
            id: "1",
            assetType: "cash_fiat",
            ownerhipType: OwnershipType.DIRECT,
            shares: [],
            supplyChanging: false,
            title: "fake asset"
        };
        const fakeCreatingUser = {
            wallet: {},
        };
        const AssetPublishCommand: AssetPublishCommand = {
            asset: fakeAsset,
            creatingUser: fakeCreatingUser,
            operation: "create",
            eventId: "event_id_fake",
            expectedSupplyDelta: 1222,
        };

        try {
            await transform(AssetPublishCommand)
            expect.fail("Expected error was not thrown");
        } catch (error) {
            expect(error.message).to.equal("Creating user has no wallet address assigned.");
        }
    });

    it("should throw an error if attempting to transform non-standard address as manager", async () => {
        const fakeAsset = {
            id: "1",
            assetType: "cash_fiat",
            ownerhipType: OwnershipType.DIRECT,
            shares: [],
            supplyChanging: false,
            title: "fake asset"
        };
        const fakeCreatingUser = {
            wallet: {
                address: "non-standard-address",
            },
        };
        const AssetPublishCommand: AssetPublishCommand = {
            asset: fakeAsset,
            creatingUser: fakeCreatingUser,
            operation: "create",
            eventId: "event_id_fak_not_tested",
            expectedSupplyDelta: 1222,
        };
        sinon.stub(checkAddress, "checkAddress").returns(false);

        try {
            await transform(AssetPublishCommand);
            expect.fail("Expected error was not thrown");
        } catch (error) {
            expect(error.message).to.equal("Attempting to transform non standard address as manager.");
        }
    });

    it("should throw an error if source asset is missing tokenId", async () => {
        const fakeAssetType = {
            type: "share",
            subType: "low",
        };
        const fakeAsset = {
            id: "1",
            assetType: "share_low",
            ownerhipType: OwnershipType.DIRECT,
            shares: [],
            sourceAsset: "1",
            supplyChanging: false,
            title: "fake asset"
        };
        const fakeCreatingUser = {
            wallet: {
                address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        };
        const fakeSourceAsset = {
            id: "1",
        };
        const AssetPublishCommand: AssetPublishCommand = {
            asset: fakeAsset,
            creatingUser: fakeCreatingUser,
            operation: "create",
            eventId: "event_id_fak_not_tested",
            expectedSupplyDelta: 1222,
        };
        sinon.stub(findCollectionItemById, "findCollectionItemById").callsFake((collectionName, itemId) => {
            if (collectionName === "assets") {
                return fakeSourceAsset;
            } else {
                return fakeAssetType;
            }
        });
        sinon.stub(checkAddress, "checkAddress").returns(true);

        try {
            await transform(AssetPublishCommand);
            expect.fail("Expected error was not thrown");
        } catch (error) {
            expect(error.message).to.equal("Cannot transform asset. Source asset missing tokenId but source assed was requested.");
        }
    });


    it("should throw an error if asset type doesnt exists", async () => {
        const fakeAssetType = {
            type: "unknown",
            subType: "unknown",
        };
        const fakeAsset = {
            id: "1",
            assetType: "unknown",
            ownerhipType: OwnershipType.DIRECT,
            shares: [],
            supplyChanging: false,
            title: "fake asset"
        };
        const fakeCreatingUser = {
            wallet: {
                address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        };
        const AssetPublishCommand: AssetPublishCommand = {
            asset: fakeAsset,
            creatingUser: fakeCreatingUser,
            operation: "create",
            eventId: "event_id_fak_not_tested",
            expectedSupplyDelta: 1222,
        };
        sinon.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
        sinon.stub(checkAddress, "checkAddress").returns(true);

        try {
            await transform(AssetPublishCommand);
            expect.fail("Expected error was not thrown");
        } catch (error) {
            expect(error.message).to.equal("Cannot transform asset type, no match.");
        }
    });

    it("should throw an error if asset supplyChanging is undefined", async () => {
        const fakeAssetType = {
            type: "unknown",
            subType: "unknown",
        };
        const fakeAsset = {
            id: "1",
            assetType: "unknown",
            ownerhipType: OwnershipType.DIRECT,
            shares: [],
            title: "fake asset"
        };
        const fakeCreatingUser = {
            wallet: {
                address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        };
        const AssetPublishCommand: AssetPublishCommand = {
            asset: fakeAsset,
            creatingUser: fakeCreatingUser,
            operation: "create",
            eventId: "event_id_fak_not_tested",
            expectedSupplyDelta: 1222,
        };
        sinon.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
        sinon.stub(checkAddress, "checkAddress").returns(true);

        try {
            await transform(AssetPublishCommand);
            expect.fail("Expected error was not thrown");
        } catch (error) {
            expect(error.message).to.equal("Asset hasnt specified supply changing.");
        }
    });

    it("should throw an error if asset name is undefined", async () => {
        const fakeAssetType = {
            type: "unknown",
            subType: "unknown",
        };
        const fakeAsset = {
            id: "1",
            assetType: "unknown",
            ownerhipType: OwnershipType.DIRECT,
            shares: [],
            supplyChanging: false,
        };
        const fakeCreatingUser = {
            wallet: {
                address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
            },
        };
        const AssetPublishCommand: AssetPublishCommand = {
            asset: fakeAsset,
            creatingUser: fakeCreatingUser,
            operation: "create",
            eventId: "event_id_fak_not_tested",
            expectedSupplyDelta: 1222,
        };
        sinon.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
        sinon.stub(checkAddress, "checkAddress").returns(true);

        try {
            await transform(AssetPublishCommand);
            expect.fail("Expected error was not thrown");
        } catch (error) {
            expect(error.message).to.equal("Asset has no name.");
        }
    });

});
