import { expect } from 'chai';
import 'mocha';
import * as dotenv from 'dotenv';
import { getNAPT, getTotalSupply, getTotalTreasuryNav } from '../../../src/core/treasury';
dotenv.config(); // Load environment variables from .env file

describe('Treasury bridge', () => {
    it('Can access total treasury NAV', async function() {
        this.timeout(5000); // Increase the timeout
        const result = await getTotalTreasuryNav()
        expect(result).to.not.equal(-1);
    });

    it('Can access total supply', async function() {
        this.timeout(5000); // Increase the timeout
        const result = await getTotalSupply()
        expect(result).to.not.equal(-1);
    });

    it('Can access NAPT', async function() {
        this.timeout(5000); // Increase the timeout
        const result = await getNAPT()
        expect(result).to.not.equal(-1);
    });
});