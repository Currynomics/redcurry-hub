import { expect } from 'chai';
import * as sinon from 'sinon';
import * as crypto from 'crypto';
import { buildAuthHeaders, buildChecksum, safeJsonObjectToArray } from '../../../../../src/core/third-party/cybavo/auth';
import * as generateRandomString from '../../../../../src/core/util/encryption';

describe('buildAuthHeaders', () => {
    const walletAuthPayload = {
        apiCode: '4GUi8UsAGF66WuQHK',
        apiSecret: '3aEuxFcCZxREWLcVfxHpZ2RJy1Kv'
    };
    const reqBody = { someKey: 'someValue' };
    const queryParams = { start_index: 0, request_number: 3 };
    const reqBodyEmpty = undefined;

    it('should return headers with correct keys, using queryParams only', () => {
        const headers = buildAuthHeaders({ walletAuthPayload: walletAuthPayload, reqBody: reqBodyEmpty, queryParams: queryParams });
        console.log("headers (relevant): ", headers)
        expect(headers).to.have.keys(['X-API-CODE', 'X-CHECKSUM', 'User-Agent', 'Content-Type']);
    });

    it('should return headers with correct keys,  using reqBody and queryParams', () => {
        const headers = buildAuthHeaders({ walletAuthPayload: walletAuthPayload, reqBody: reqBody, queryParams: queryParams });
        console.log("headers: ", headers)
        expect(headers).to.have.keys(['X-API-CODE', 'X-CHECKSUM', 'User-Agent', 'Content-Type']);
    });

    it('should return headers with correct keys with empty request body', () => {
        const headers = buildAuthHeaders({ walletAuthPayload: walletAuthPayload, reqBody: reqBodyEmpty, queryParams: "" });
        console.log("headers: ", headers)
        expect(headers).to.have.keys(['X-API-CODE', 'X-CHECKSUM', 'User-Agent', 'Content-Type']);
    });

    it('should set X-API-CODE from walletAuthPayload', () => {
        const headers = buildAuthHeaders({ walletAuthPayload: walletAuthPayload, reqBody: reqBody, queryParams: "" });
        expect(headers['X-API-CODE']).to.equal(walletAuthPayload.apiCode);
    });

    it('should set User-Agent and Content-Type correctly', () => {
        const headers = buildAuthHeaders({ walletAuthPayload: walletAuthPayload, reqBody: reqBody, queryParams: "" });
        expect(headers['User-Agent']).to.equal('nodejs');
        expect(headers['Content-Type']).to.equal('application/json');
    });

    it('should set X-CHECKSUM using buildChecksum function', () => {
        sinon.stub(generateRandomString, "generateRandomString").returns("ksjJN78hsj");
        const expectedChecksum = buildChecksum({secret:walletAuthPayload.apiSecret, reqBody:reqBody, queryParams: ""});
        const headers = buildAuthHeaders({ walletAuthPayload: walletAuthPayload, reqBody: reqBody, queryParams: "" });
        expect(headers['X-CHECKSUM']).to.equal(expectedChecksum);
    });
});
