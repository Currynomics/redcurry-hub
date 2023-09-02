import { expect } from 'chai';
import { TxnStatus } from '../../../../../../src/core/assets/model/GovOnChainTxState';
import { CallbackState } from '../../../../../../src/core/third-party/cybavo/model/CallbackState';
import { ProcessingState } from '../../../../../../src/core/third-party/cybavo/model/ProcessingState';
import { transformTxnCallbackToAssetTxnState } from '../../../../../../src/core/third-party/cybavo/transformers/ingress';

describe('transformTxnCallbackToAssetTxnState()', () => {
    it('should return a successful transaction state', () => {
        const result = transformTxnCallbackToAssetTxnState(
            CallbackState.InChain,
            ProcessingState.Done,
            "prefix_property_dfksjdnlajdsnins34klm_dmjkln34",
            "0xasfjhgfdsghhgfdsafhggfdsafsg",
            "ext_wallet_id_123456",
            "hash_kjhgfdsiuytre987654",
            { token_id: 5434545, }
        );

        expect(result).to.deep.equal({
            tokenId: 5434545,
            txnId: "hash_kjhgfdsiuytre987654",
            orderId: "prefix_property_dfksjdnlajdsnins34klm_dmjkln34",
            syncedOnChain: true,
            txnStatus: TxnStatus.SUCCESS,
            originInChainState: "InChainDone",
            contractAddress: "0xasfjhgfdsghhgfdsafhggfdsafsg",
            statusReason: "Transaction was confirmed on blockchain by Cybavo.",
            walletExtId: "ext_wallet_id_123456",
        });
    });


    it("should return a failed transaction state for CallbackState.Failed", () => {
        const result = transformTxnCallbackToAssetTxnState(
            CallbackState.Failed,
            ProcessingState.Done,
            "orderId2",
            "tokenAddress2",
            "walletId2",
            "txid2",
            { err_reason: "Error occurred" }
        );

        expect(result).to.deep.equal({
            tokenId: -1,
            txnId: "txid2",
            orderId: "orderId2",
            syncedOnChain: true,
            txnStatus: TxnStatus.FAIL,
            originInChainState: "InChainFailed",
            contractAddress: "tokenAddress2",
            statusReason: "Error occurred",
            walletExtId: "walletId2",
        });
    });

    it("should return a failed transaction state for CallbackState.InChainFailed", () => {
        const result = transformTxnCallbackToAssetTxnState(
            CallbackState.InChainFailed,
            ProcessingState.Done,
            "orderId3",
            "tokenAddress3",
            "walletId3",
            "txid3",
            { err_reason: "Error occurred" }
        );

        expect(result).to.deep.equal({
            tokenId: -1,
            txnId: "txid3",
            orderId: "orderId3",
            syncedOnChain: true,
            txnStatus: TxnStatus.FAIL,
            originInChainState: "InChainFailed",
            contractAddress: "tokenAddress3",
            statusReason: "Error occurred",
            walletExtId: "walletId3",
        });
    });

    it("should return false if an error is thrown", () => {
        const result = transformTxnCallbackToAssetTxnState(
            CallbackState.InChain,
            ProcessingState.Done,
            "orderId4",
            "tokenAddress4",
            "walletId4",
            "txid4",
            null, // Pass null to trigger an error
        );

        expect(result).to.equal(false);
    });
})
