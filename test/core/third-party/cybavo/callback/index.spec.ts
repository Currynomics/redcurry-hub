import sinon from "sinon";
const crypto = require('crypto');

import { expect } from 'chai';
import { process } from '../../../../../src/core/third-party/cybavo/callback';
import { CallbackType } from "../../../../../src/core/third-party/cybavo/model/CallbackType";
import * as transformTxnCallbackToAssetTxnState from '../../../../../src/core/third-party/cybavo/transformers/ingress';
import * as setAssetOnChainTxnStatus from "../../../../../src/core/assets/services";
import { CallbackState } from "../../../../../src/core/third-party/cybavo/model/CallbackState";
import { ProcessingState } from "../../../../../src/core/third-party/cybavo/model/ProcessingState";
import { validCallback } from "../../../../../src/core/third-party/cybavo/auth";
import * as getWalletByExternalId from "../../../../../src/core/wallets/services";
import * as decryptWalletSecret from "../../../../../src/core/wallets/services/auth";


const ERR_MSG_NO_ORDER_ID = "Missing required order_id in body params."
const ERR_MSG_MISSING_PARAMS = "Missing required body params."
const ERR_MSG_UNK_CALLBACK_TYPE = "Unsupported callback type: "

describe("cybavo callback -> process()", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("should handle Deposit", async () => {
        const req = { body: { type: CallbackType.Deposit } };
        const response = await process(req);
        expect(response).to.deep.equal({
            data: "OK",
            code: 200,
            message: "Received, not processed (not yet implemented)."
        });
    });

    it("should handle Withdraw without orderId", async () => {
        const req = { body: { type: CallbackType.Withdraw } };
        const response = await process(req);
        expect(response).to.deep.equal({
            data: "FAIL",
            code: 400,
            message: ERR_MSG_NO_ORDER_ID
        });
    });

    it("should handle Withdraw with missing params", async () => {
        const req = {
            body: {
                type: CallbackType.Withdraw,
                order_id: "123",
                // Missing other required params
            }
        };
        const response = await process(req);
        expect(response).to.deep.equal({
            data: "FAIL",
            code: 400,
            message: ERR_MSG_MISSING_PARAMS
        });
    });

    it("should handle unknown callback type", async () => {
        const req = { body: { type: "UnknownType" } };
        const response = await process(req);
        expect(response).to.deep.equal({
            data: "FAIL",
            code: 400,
            message: ERR_MSG_UNK_CALLBACK_TYPE + "UnknownType"
        });
    });

    it("should handle Withdraw with all required params", async () => {
        const req = {
            body: {
                type: CallbackType.Withdraw,
                order_id: "123",
                state: CallbackState.InChain,
                processing_state: ProcessingState.InChain,
                token_address: "someTokenAddress",
                wallet_id: "someWalletId",
                txid: "someTxid",
                addon: { token_id: 5434545, }

            }
        };
        sinon.stub(setAssetOnChainTxnStatus, "setAssetOnChainTxnStatus").resolves(true);
        const response = await process(req);

        expect(response).to.deep.equal({
            data: "OK",
            code: 200,
            message: "Received"
        });
    });

    it("should handle errors and return error response", async () => {
        const req = { body: { type: "ErrorTrigger" } };
        const errorMsg = "FAIL";

        sinon.stub(transformTxnCallbackToAssetTxnState, "transformTxnCallbackToAssetTxnState").throws(new Error(errorMsg));

        const response = await process(req);

        expect(response).to.deep.equal({
            data: "FAIL",
            code: 400,
            message: ERR_MSG_UNK_CALLBACK_TYPE + req.body.type
        });
    });

});

describe('cybavo callback -> validCallback()', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should return an error if wallet_id is missing', async () => {
        const req = { body: {} };
        const result = await validCallback(req);
        expect(result).to.deep.equal({ pass: false, code: 400, message: "Missing wallet_id in request body" });
    });

    it('should return an error if wallet is not found', async () => {
        const req = { body: { wallet_id: 'nonexistent' } };
        sinon.stub(getWalletByExternalId, 'getWalletByExternalId').resolves(null);
        const result = await validCallback(req);
        expect(result).to.deep.equal({ pass: false, code: 404, message: "Wallet not found" });
    });

    it('should return an error if checksum header is missing', async () => {
        const req = {
            body: { wallet_id: 'existing' },
            get: () => null
        };
        sinon.stub(getWalletByExternalId, 'getWalletByExternalId').resolves({ id: 'existing' });
        const result = await validCallback(req);
        expect(result).to.deep.equal({ pass: false, code: 400, message: "Missing checksum header" });
    });

    it('should return an error if checksum is incorrect', async () => {
        const req = {
            body: { wallet_id: 'existing' },
            get: (header) => 'incorrect-checksum'
        };
        sinon.stub(getWalletByExternalId, 'getWalletByExternalId').resolves({ id: 'existing' });
        sinon.stub(decryptWalletSecret, 'decryptWalletSecret').resolves('api-secret');
        const result = await validCallback(req);
        expect(result).to.deep.equal({ pass: false, code: 401, message: "Unauthorized" });
    });

    it('should return success if checksum is correct', async () => {
        const req = {
            body: { wallet_id: 'existing' },
            get: (header) => 'correct-checksum'
        };
        sinon.stub(getWalletByExternalId, 'getWalletByExternalId').resolves({ id: 'existing' });
        sinon.stub(decryptWalletSecret, 'decryptWalletSecret').resolves('api-secret');

        const payload = JSON.stringify(req.body) + 'api-secret';
        const buff = Buffer.from(crypto.createHash('sha256').update(payload).digest());
        const checksum = buff.toString('base64').replace(/\+/g, "-").replace(/\//g, "_");
        req.get = (header) => checksum;

        const result = await validCallback(req);
        expect(result).to.deep.equal({ pass: true, code: 200, message: "OK" });
    });
});