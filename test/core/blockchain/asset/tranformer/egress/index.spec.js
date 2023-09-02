"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = __importDefault(require("sinon"));
var OwnershipType_1 = __importDefault(require("../../../../../../src/core/assets/model/enums/OwnershipType"));
var findCollectionItemById = __importStar(require("../../../../../../src/core/payload/localApi"));
var checkAddress = __importStar(require("../../../../../../src/core/third-party/ethers/ethersService"));
var calculateAssetPosition = __importStar(require("../../../../../../src/core/assets/services/calculations"));
var egress_1 = require("../../../../../../src/core/blockchain/asset/transformer/egress");
describe("transform asset publish request to assetOc -> transform()", function () {
    afterEach(function () {
        sinon_1.default.restore();
    });
    it("should return valid AssetOC object with valid input", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeAssetType, fakeAsset, fakeCreatingUser, AssetPublishCommand, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fakeAssetType = {
                        type: "cash",
                        subType: "fiat",
                    };
                    fakeAsset = {
                        id: "1",
                        assetType: "cash_fiat",
                        ownerhipType: OwnershipType_1.default.DIRECT,
                        shares: [],
                        supplyChanging: false,
                        title: "fake asset"
                    };
                    fakeCreatingUser = {
                        wallet: {
                            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                        },
                    };
                    AssetPublishCommand = {
                        asset: fakeAsset,
                        creatingUser: fakeCreatingUser,
                        operation: "create",
                        eventId: "event_id_fak_not_tested",
                        expectedSupplyDelta: 1222,
                    };
                    sinon_1.default.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
                    sinon_1.default.stub(checkAddress, "checkAddress").returns(true);
                    sinon_1.default.stub(calculateAssetPosition, "calculateAssetPosition").returns({
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
                    return [4 /*yield*/, (0, egress_1.transform)(AssetPublishCommand)];
                case 1:
                    result = _a.sent();
                    (0, chai_1.expect)(result).to.be.an("object");
                    (0, chai_1.expect)(result.tokenId).to.equal(0);
                    (0, chai_1.expect)(result.sourceId).to.equal(0);
                    (0, chai_1.expect)(result.creator).to.equal("0x0000000000000000000000000000000000000000");
                    (0, chai_1.expect)(result.managers).to.have.lengthOf(1);
                    (0, chai_1.expect)(result.managers[0]).to.equal("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
                    (0, chai_1.expect)(result.value.currency).to.equal(0); // 0 equal EUR enum on-chain
                    (0, chai_1.expect)(result.assetType).to.equal(0);
                    (0, chai_1.expect)(result.assetSubType).to.equal(0);
                    (0, chai_1.expect)(result.owner).to.equal("0x0000000000000000000000000000000000000000");
                    (0, chai_1.expect)(result.name).to.be.undefined;
                    (0, chai_1.expect)(result.status).to.equal(0);
                    (0, chai_1.expect)(result.qtyOwned).to.equal("");
                    (0, chai_1.expect)(result.ownershipType).to.equal(0);
                    (0, chai_1.expect)(result.lastAuditedAt).to.equal(0);
                    (0, chai_1.expect)(result.externalId).to.equal("1");
                    (0, chai_1.expect)(result.supplyChanging).to.equal(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should return valid AssetOC object with valid input 2", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeAssetType, fakeAsset, fakeCreatingUser, AssetPublishCommand, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fakeAssetType = {
                        type: "share",
                        subType: "low",
                    };
                    fakeAsset = {
                        id: "1",
                        assetType: "share_low",
                        ownerhipType: OwnershipType_1.default.DIRECT,
                        shares: [],
                        supplyChanging: true,
                        title: "fake asset"
                    };
                    fakeCreatingUser = {
                        wallet: {
                            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                        },
                    };
                    AssetPublishCommand = {
                        asset: fakeAsset,
                        creatingUser: fakeCreatingUser,
                        operation: "create",
                        eventId: "event_id_fak_not_tested",
                        expectedSupplyDelta: 1222,
                    };
                    sinon_1.default.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
                    sinon_1.default.stub(checkAddress, "checkAddress").returns(true);
                    sinon_1.default.stub(calculateAssetPosition, "calculateAssetPosition").returns({
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
                    return [4 /*yield*/, (0, egress_1.transform)(AssetPublishCommand)];
                case 1:
                    result = _a.sent();
                    (0, chai_1.expect)(result).to.be.an("object");
                    (0, chai_1.expect)(result.tokenId).to.equal(0);
                    (0, chai_1.expect)(result.sourceId).to.equal(0);
                    (0, chai_1.expect)(result.creator).to.equal("0x0000000000000000000000000000000000000000");
                    (0, chai_1.expect)(result.managers).to.have.lengthOf(1);
                    (0, chai_1.expect)(result.managers[0]).to.equal("0x742d35Cc6634C0532925a3b844Bc454e4438f44e");
                    (0, chai_1.expect)(result.value.currency).to.equal(0); // 0 equal EUR enum on-chain
                    (0, chai_1.expect)(result.assetType).to.equal(2);
                    (0, chai_1.expect)(result.assetSubType).to.equal(4);
                    (0, chai_1.expect)(result.owner).to.equal("0x0000000000000000000000000000000000000000");
                    (0, chai_1.expect)(result.name).to.be.undefined;
                    (0, chai_1.expect)(result.status).to.equal(0);
                    (0, chai_1.expect)(result.qtyOwned).to.equal("");
                    (0, chai_1.expect)(result.ownershipType).to.equal(0);
                    (0, chai_1.expect)(result.lastAuditedAt).to.equal(0);
                    (0, chai_1.expect)(result.externalId).to.equal("1");
                    (0, chai_1.expect)(result.supplyChanging).to.equal(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should throw an error if creating user has no wallet address", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeAsset, fakeCreatingUser, AssetPublishCommand, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fakeAsset = {
                        id: "1",
                        assetType: "cash_fiat",
                        ownerhipType: OwnershipType_1.default.DIRECT,
                        shares: [],
                        supplyChanging: false,
                        title: "fake asset"
                    };
                    fakeCreatingUser = {
                        wallet: {},
                    };
                    AssetPublishCommand = {
                        asset: fakeAsset,
                        creatingUser: fakeCreatingUser,
                        operation: "create",
                        eventId: "event_id_fake",
                        expectedSupplyDelta: 1222,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, egress_1.transform)(AssetPublishCommand)];
                case 2:
                    _a.sent();
                    chai_1.expect.fail("Expected error was not thrown");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    (0, chai_1.expect)(error_1.message).to.equal("Creating user has no wallet address assigned.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it("should throw an error if attempting to transform non-standard address as manager", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeAsset, fakeCreatingUser, AssetPublishCommand, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fakeAsset = {
                        id: "1",
                        assetType: "cash_fiat",
                        ownerhipType: OwnershipType_1.default.DIRECT,
                        shares: [],
                        supplyChanging: false,
                        title: "fake asset"
                    };
                    fakeCreatingUser = {
                        wallet: {
                            address: "non-standard-address",
                        },
                    };
                    AssetPublishCommand = {
                        asset: fakeAsset,
                        creatingUser: fakeCreatingUser,
                        operation: "create",
                        eventId: "event_id_fak_not_tested",
                        expectedSupplyDelta: 1222,
                    };
                    sinon_1.default.stub(checkAddress, "checkAddress").returns(false);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, egress_1.transform)(AssetPublishCommand)];
                case 2:
                    _a.sent();
                    chai_1.expect.fail("Expected error was not thrown");
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    (0, chai_1.expect)(error_2.message).to.equal("Attempting to transform non standard address as manager.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it("should throw an error if source asset is missing tokenId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeAssetType, fakeAsset, fakeCreatingUser, fakeSourceAsset, AssetPublishCommand, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fakeAssetType = {
                        type: "share",
                        subType: "low",
                    };
                    fakeAsset = {
                        id: "1",
                        assetType: "share_low",
                        ownerhipType: OwnershipType_1.default.DIRECT,
                        shares: [],
                        sourceAsset: "1",
                        supplyChanging: false,
                        title: "fake asset"
                    };
                    fakeCreatingUser = {
                        wallet: {
                            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                        },
                    };
                    fakeSourceAsset = {
                        id: "1",
                    };
                    AssetPublishCommand = {
                        asset: fakeAsset,
                        creatingUser: fakeCreatingUser,
                        operation: "create",
                        eventId: "event_id_fak_not_tested",
                        expectedSupplyDelta: 1222,
                    };
                    sinon_1.default.stub(findCollectionItemById, "findCollectionItemById").callsFake(function (collectionName, itemId) {
                        if (collectionName === "assets") {
                            return fakeSourceAsset;
                        }
                        else {
                            return fakeAssetType;
                        }
                    });
                    sinon_1.default.stub(checkAddress, "checkAddress").returns(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, egress_1.transform)(AssetPublishCommand)];
                case 2:
                    _a.sent();
                    chai_1.expect.fail("Expected error was not thrown");
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    (0, chai_1.expect)(error_3.message).to.equal("Cannot transform asset. Source asset missing tokenId but source assed was requested.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it("should throw an error if asset type doesnt exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeAssetType, fakeAsset, fakeCreatingUser, AssetPublishCommand, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fakeAssetType = {
                        type: "unknown",
                        subType: "unknown",
                    };
                    fakeAsset = {
                        id: "1",
                        assetType: "unknown",
                        ownerhipType: OwnershipType_1.default.DIRECT,
                        shares: [],
                        supplyChanging: false,
                        title: "fake asset"
                    };
                    fakeCreatingUser = {
                        wallet: {
                            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                        },
                    };
                    AssetPublishCommand = {
                        asset: fakeAsset,
                        creatingUser: fakeCreatingUser,
                        operation: "create",
                        eventId: "event_id_fak_not_tested",
                        expectedSupplyDelta: 1222,
                    };
                    sinon_1.default.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
                    sinon_1.default.stub(checkAddress, "checkAddress").returns(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, egress_1.transform)(AssetPublishCommand)];
                case 2:
                    _a.sent();
                    chai_1.expect.fail("Expected error was not thrown");
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    (0, chai_1.expect)(error_4.message).to.equal("Cannot transform asset type, no match.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it("should throw an error if asset supplyChanging is undefined", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeAssetType, fakeAsset, fakeCreatingUser, AssetPublishCommand, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fakeAssetType = {
                        type: "unknown",
                        subType: "unknown",
                    };
                    fakeAsset = {
                        id: "1",
                        assetType: "unknown",
                        ownerhipType: OwnershipType_1.default.DIRECT,
                        shares: [],
                        title: "fake asset"
                    };
                    fakeCreatingUser = {
                        wallet: {
                            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                        },
                    };
                    AssetPublishCommand = {
                        asset: fakeAsset,
                        creatingUser: fakeCreatingUser,
                        operation: "create",
                        eventId: "event_id_fak_not_tested",
                        expectedSupplyDelta: 1222,
                    };
                    sinon_1.default.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
                    sinon_1.default.stub(checkAddress, "checkAddress").returns(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, egress_1.transform)(AssetPublishCommand)];
                case 2:
                    _a.sent();
                    chai_1.expect.fail("Expected error was not thrown");
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    (0, chai_1.expect)(error_5.message).to.equal("Asset hasnt specified supply changing.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    it("should throw an error if asset name is undefined", function () { return __awaiter(void 0, void 0, void 0, function () {
        var fakeAssetType, fakeAsset, fakeCreatingUser, AssetPublishCommand, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fakeAssetType = {
                        type: "unknown",
                        subType: "unknown",
                    };
                    fakeAsset = {
                        id: "1",
                        assetType: "unknown",
                        ownerhipType: OwnershipType_1.default.DIRECT,
                        shares: [],
                        supplyChanging: false,
                    };
                    fakeCreatingUser = {
                        wallet: {
                            address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
                        },
                    };
                    AssetPublishCommand = {
                        asset: fakeAsset,
                        creatingUser: fakeCreatingUser,
                        operation: "create",
                        eventId: "event_id_fak_not_tested",
                        expectedSupplyDelta: 1222,
                    };
                    sinon_1.default.stub(findCollectionItemById, "findCollectionItemById").resolves(fakeAssetType);
                    sinon_1.default.stub(checkAddress, "checkAddress").returns(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, egress_1.transform)(AssetPublishCommand)];
                case 2:
                    _a.sent();
                    chai_1.expect.fail("Expected error was not thrown");
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    (0, chai_1.expect)(error_6.message).to.equal("Asset has no name.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
});
