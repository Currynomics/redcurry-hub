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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = __importStar(require("sinon"));
var auth_1 = require("../../../../../src/core/third-party/cybavo/auth");
var generateRandomString = __importStar(require("../../../../../src/core/util/encryption"));
describe('buildAuthHeaders', function () {
    var walletAuthPayload = {
        apiCode: '4GUi8UsAGF66WuQHK',
        apiSecret: '3aEuxFcCZxREWLcVfxHpZ2RJy1Kv'
    };
    var reqBody = { someKey: 'someValue' };
    var queryParams = { start_index: 0, request_number: 3 };
    var reqBodyEmpty = undefined;
    it('should return headers with correct keys, using queryParams only', function () {
        var headers = (0, auth_1.buildAuthHeaders)({ walletAuthPayload: walletAuthPayload, reqBody: reqBodyEmpty, queryParams: queryParams });
        console.log("headers (relevant): ", headers);
        (0, chai_1.expect)(headers).to.have.keys(['X-API-CODE', 'X-CHECKSUM', 'User-Agent', 'Content-Type']);
    });
    it('should return headers with correct keys,  using reqBody and queryParams', function () {
        var headers = (0, auth_1.buildAuthHeaders)({ walletAuthPayload: walletAuthPayload, reqBody: reqBody, queryParams: queryParams });
        console.log("headers: ", headers);
        (0, chai_1.expect)(headers).to.have.keys(['X-API-CODE', 'X-CHECKSUM', 'User-Agent', 'Content-Type']);
    });
    it('should return headers with correct keys with empty request body', function () {
        var headers = (0, auth_1.buildAuthHeaders)({ walletAuthPayload: walletAuthPayload, reqBody: reqBodyEmpty, queryParams: "" });
        console.log("headers: ", headers);
        (0, chai_1.expect)(headers).to.have.keys(['X-API-CODE', 'X-CHECKSUM', 'User-Agent', 'Content-Type']);
    });
    it('should set X-API-CODE from walletAuthPayload', function () {
        var headers = (0, auth_1.buildAuthHeaders)({ walletAuthPayload: walletAuthPayload, reqBody: reqBody, queryParams: "" });
        (0, chai_1.expect)(headers['X-API-CODE']).to.equal(walletAuthPayload.apiCode);
    });
    it('should set User-Agent and Content-Type correctly', function () {
        var headers = (0, auth_1.buildAuthHeaders)({ walletAuthPayload: walletAuthPayload, reqBody: reqBody, queryParams: "" });
        (0, chai_1.expect)(headers['User-Agent']).to.equal('nodejs');
        (0, chai_1.expect)(headers['Content-Type']).to.equal('application/json');
    });
    it('should set X-CHECKSUM using buildChecksum function', function () {
        sinon.stub(generateRandomString, "generateRandomString").returns("ksjJN78hsj");
        var expectedChecksum = (0, auth_1.buildChecksum)({ secret: walletAuthPayload.apiSecret, reqBody: reqBody, queryParams: "" });
        var headers = (0, auth_1.buildAuthHeaders)({ walletAuthPayload: walletAuthPayload, reqBody: reqBody, queryParams: "" });
        (0, chai_1.expect)(headers['X-CHECKSUM']).to.equal(expectedChecksum);
    });
});
