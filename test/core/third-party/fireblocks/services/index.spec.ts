import { expect } from 'chai';
import 'mocha';
import * as dotenv from 'dotenv';
import { getFireblocksClient } from '../../../../../src/core/third-party/fireblocks/services';
dotenv.config(); // Load environment variables from .env file

describe('Fireblocks', () => {
    it('Client can retrieve account details.', async function() {
        this.timeout(5000); // Increase the timeout
        const fbClient = await getFireblocksClient()
        expect(fbClient).to.not.be.a('string');
        //@ts-ignore // ignores string check as expect is already in place
        const result = await fbClient.getAccountDetails()
        expect(result).to.not.equal(false);
    });
});