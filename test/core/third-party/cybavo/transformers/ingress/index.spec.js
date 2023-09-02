"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var AssetOnChainTxnState_1 = require("../../../../../../src/core/assets/model/GovOnChainTxState");
var CallbackState_1 = require("../../../../../../src/core/third-party/cybavo/model/CallbackState");
var ProcessingState_1 = require("../../../../../../src/core/third-party/cybavo/model/ProcessingState");
var ingress_1 = require("../../../../../../src/core/third-party/cybavo/transformers/ingress");
describe('transformTxnCallbackToAssetTxnState()', function () {
    it('should return a successful transaction state', function () {
        var result = (0, ingress_1.transformTxnCallbackToAssetTxnState)(CallbackState_1.CallbackState.InChain, ProcessingState_1.ProcessingState.Done, "prefix_property_dfksjdnlajdsnins34klm_dmjkln34", "0xasfjhgfdsghhgfdsafhggfdsafsg", "ext_wallet_id_123456", "hash_kjhgfdsiuytre987654", { token_id: 5434545, });
        (0, chai_1.expect)(result).to.deep.equal({
            tokenId: 5434545,
            txnId: "hash_kjhgfdsiuytre987654",
            orderId: "prefix_property_dfksjdnlajdsnins34klm_dmjkln34",
            syncedOnChain: true,
            txnStatus: AssetOnChainTxnState_1.TxnStatus.SUCCESS,
            originInChainState: "InChainDone",
            contractAddress: "0xasfjhgfdsghhgfdsafhggfdsafsg",
            statusReason: "Transaction was confirmed on blockchain by Cybavo.",
            walletExtId: "ext_wallet_id_123456",
        });
    });
    it("should return a failed transaction state for CallbackState.Failed", function () {
        var result = (0, ingress_1.transformTxnCallbackToAssetTxnState)(CallbackState_1.CallbackState.Failed, ProcessingState_1.ProcessingState.Done, "orderId2", "tokenAddress2", "walletId2", "txid2", { err_reason: "Error occurred" });
        (0, chai_1.expect)(result).to.deep.equal({
            tokenId: -1,
            txnId: "txid2",
            orderId: "orderId2",
            syncedOnChain: true,
            txnStatus: AssetOnChainTxnState_1.TxnStatus.FAIL,
            originInChainState: "InChainFailed",
            contractAddress: "tokenAddress2",
            statusReason: "Error occurred",
            walletExtId: "walletId2",
        });
    });
    it("should return a failed transaction state for CallbackState.InChainFailed", function () {
        var result = (0, ingress_1.transformTxnCallbackToAssetTxnState)(CallbackState_1.CallbackState.InChainFailed, ProcessingState_1.ProcessingState.Done, "orderId3", "tokenAddress3", "walletId3", "txid3", { err_reason: "Error occurred" });
        (0, chai_1.expect)(result).to.deep.equal({
            tokenId: -1,
            txnId: "txid3",
            orderId: "orderId3",
            syncedOnChain: true,
            txnStatus: AssetOnChainTxnState_1.TxnStatus.FAIL,
            originInChainState: "InChainFailed",
            contractAddress: "tokenAddress3",
            statusReason: "Error occurred",
            walletExtId: "walletId3",
        });
    });
    it("should return false if an error is thrown", function () {
        var result = (0, ingress_1.transformTxnCallbackToAssetTxnState)(CallbackState_1.CallbackState.InChain, ProcessingState_1.ProcessingState.Done, "orderId4", "tokenAddress4", "walletId4", "txid4", null);
        (0, chai_1.expect)(result).to.equal(false);
    });
});
