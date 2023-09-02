import { expect } from 'chai';
import sinon from "sinon";
import 'mocha';
import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import { getSecret, setSecret } from "../../../../../src/core/third-party/google/secret-manager";

describe('Google Secret Manager', () => {
    it('after setting a secret, the value is same when getting it.', async function() {
        this.timeout(5000); // Increase the timeout

        const testSecret = "my_api_key_secret_random@£${[]}__1234567890_abcdefghijklmnopqrstuvwxyzäõö"
        const envVarMock = sinon.stub(process.env, 'GOOGLE_PROJECT_NAME').value('redcurry');
        await setSecret("testSecret", testSecret)
        const result = await getSecret("testSecret")
        expect(result).to.equal(testSecret);
        envVarMock.restore();
    });
});