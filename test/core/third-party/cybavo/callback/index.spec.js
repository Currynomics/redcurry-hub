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
var sinon_1 = __importDefault(require("sinon"));
var crypto = require('crypto');
var chai_1 = require("chai");
var callback_1 = require("../../../../../src/core/third-party/cybavo/callback");
var CallbackType_1 = require("../../../../../src/core/third-party/cybavo/model/CallbackType");
var transformTxnCallbackToAssetTxnState = __importStar(require("../../../../../src/core/third-party/cybavo/transformers/ingress"));
var setAssetOnChainTxnStatus = __importStar(require("../../../../../src/core/assets/services"));
var CallbackState_1 = require("../../../../../src/core/third-party/cybavo/model/CallbackState");
var ProcessingState_1 = require("../../../../../src/core/third-party/cybavo/model/ProcessingState");
var auth_1 = require("../../../../../src/core/third-party/cybavo/auth");
var getWalletByExternalId = __importStar(require("../../../../../src/core/wallets/services"));
var decryptWalletSecret = __importStar(require("../../../../../src/core/wallets/services/auth"));
var ERR_MSG_NO_ORDER_ID = "Missing required order_id in body params.";
var ERR_MSG_MISSING_PARAMS = "Missing required body params.";
var ERR_MSG_UNK_CALLBACK_TYPE = "Unsupported callback type: ";
describe("cybavo callback -> process()", function () {
    afterEach(function () {
        sinon_1.default.restore();
    });
    it("should handle Deposit", function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = { body: { type: CallbackType_1.CallbackType.Deposit } };
                    return [4 /*yield*/, (0, callback_1.process)(req)];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response).to.deep.equal({
                        data: "OK",
                        code: 200,
                        message: "Received, not processed (not yet implemented)."
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle Withdraw without orderId", function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = { body: { type: CallbackType_1.CallbackType.Withdraw } };
                    return [4 /*yield*/, (0, callback_1.process)(req)];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response).to.deep.equal({
                        data: "FAIL",
                        code: 400,
                        message: ERR_MSG_NO_ORDER_ID
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle Withdraw with missing params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        body: {
                            type: CallbackType_1.CallbackType.Withdraw,
                            order_id: "123",
                            // Missing other required params
                        }
                    };
                    return [4 /*yield*/, (0, callback_1.process)(req)];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response).to.deep.equal({
                        data: "FAIL",
                        code: 400,
                        message: ERR_MSG_MISSING_PARAMS
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle unknown callback type", function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = { body: { type: "UnknownType" } };
                    return [4 /*yield*/, (0, callback_1.process)(req)];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response).to.deep.equal({
                        data: "FAIL",
                        code: 400,
                        message: ERR_MSG_UNK_CALLBACK_TYPE + "UnknownType"
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle Withdraw with all required params", function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        body: {
                            type: CallbackType_1.CallbackType.Withdraw,
                            order_id: "123",
                            state: CallbackState_1.CallbackState.InChain,
                            processing_state: ProcessingState_1.ProcessingState.InChain,
                            token_address: "someTokenAddress",
                            wallet_id: "someWalletId",
                            txid: "someTxid",
                            addon: { token_id: 5434545, }
                        }
                    };
                    sinon_1.default.stub(setAssetOnChainTxnStatus, "setAssetOnChainTxnStatus").resolves(true);
                    return [4 /*yield*/, (0, callback_1.process)(req)];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response).to.deep.equal({
                        data: "OK",
                        code: 200,
                        message: "Received"
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    it("should handle errors and return error response", function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, errorMsg, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = { body: { type: "ErrorTrigger" } };
                    errorMsg = "FAIL";
                    sinon_1.default.stub(transformTxnCallbackToAssetTxnState, "transformTxnCallbackToAssetTxnState").throws(new Error(errorMsg));
                    return [4 /*yield*/, (0, callback_1.process)(req)];
                case 1:
                    response = _a.sent();
                    (0, chai_1.expect)(response).to.deep.equal({
                        data: "FAIL",
                        code: 400,
                        message: ERR_MSG_UNK_CALLBACK_TYPE + req.body.type
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('cybavo callback -> validCallback()', function () {
    afterEach(function () {
        sinon_1.default.restore();
    });
    it('should return an error if wallet_id is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = { body: {} };
                    return [4 /*yield*/, (0, auth_1.validCallback)(req)];
                case 1:
                    result = _a.sent();
                    (0, chai_1.expect)(result).to.deep.equal({ pass: false, code: 400, message: "Missing wallet_id in request body" });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an error if wallet is not found', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = { body: { wallet_id: 'nonexistent' } };
                    sinon_1.default.stub(getWalletByExternalId, 'getWalletByExternalId').resolves(null);
                    return [4 /*yield*/, (0, auth_1.validCallback)(req)];
                case 1:
                    result = _a.sent();
                    (0, chai_1.expect)(result).to.deep.equal({ pass: false, code: 404, message: "Wallet not found" });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an error if checksum header is missing', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        body: { wallet_id: 'existing' },
                        get: function () { return null; }
                    };
                    sinon_1.default.stub(getWalletByExternalId, 'getWalletByExternalId').resolves({ id: 'existing' });
                    return [4 /*yield*/, (0, auth_1.validCallback)(req)];
                case 1:
                    result = _a.sent();
                    (0, chai_1.expect)(result).to.deep.equal({ pass: false, code: 400, message: "Missing checksum header" });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return an error if checksum is incorrect', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        body: { wallet_id: 'existing' },
                        get: function (header) { return 'incorrect-checksum'; }
                    };
                    sinon_1.default.stub(getWalletByExternalId, 'getWalletByExternalId').resolves({ id: 'existing' });
                    sinon_1.default.stub(decryptWalletSecret, 'decryptWalletSecret').resolves('api-secret');
                    return [4 /*yield*/, (0, auth_1.validCallback)(req)];
                case 1:
                    result = _a.sent();
                    (0, chai_1.expect)(result).to.deep.equal({ pass: false, code: 401, message: "Unauthorized" });
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return success if checksum is correct', function () { return __awaiter(void 0, void 0, void 0, function () {
        var req, payload, buff, checksum, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    req = {
                        body: { wallet_id: 'existing' },
                        get: function (header) { return 'correct-checksum'; }
                    };
                    sinon_1.default.stub(getWalletByExternalId, 'getWalletByExternalId').resolves({ id: 'existing' });
                    sinon_1.default.stub(decryptWalletSecret, 'decryptWalletSecret').resolves('api-secret');
                    payload = JSON.stringify(req.body) + 'api-secret';
                    buff = Buffer.from(crypto.createHash('sha256').update(payload).digest());
                    checksum = buff.toString('base64').replace(/\+/g, "-").replace(/\//g, "_");
                    req.get = function (header) { return checksum; };
                    return [4 /*yield*/, (0, auth_1.validCallback)(req)];
                case 1:
                    result = _a.sent();
                    (0, chai_1.expect)(result).to.deep.equal({ pass: true, code: 200, message: "OK" });
                    return [2 /*return*/];
            }
        });
    }); });
});
