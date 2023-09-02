import { SecretManagerServiceClient } from '@google-cloud/secret-manager';


const getSecret = async (secretName: string): Promise<string> => {
    const client = new SecretManagerServiceClient();

    const name = `projects/${process.env.GOOGLE_PROJECT_NAME}/secrets/${secretName}/versions/latest`;

    const [version] = await client.accessSecretVersion({ name });

    const secretValue = version.payload.data.toString();

    return secretValue;
}

const setSecret = async (secretName: string, secretValue: string): Promise<string> => {
    const client = new SecretManagerServiceClient();

    const parent = `projects/${process.env.GOOGLE_PROJECT_NAME}`;

    try {
        await client.createSecret({
            parent,
            secretId: secretName,
            secret: {
                replication: {
                    automatic: {},
                },
            },
        });
    } catch (error) {
        if (error.code !== 6) {
            throw error;
        }
    }

    const [version] = await client.addSecretVersion({
        parent: `projects/${process.env.GOOGLE_PROJECT_NAME}/secrets/${secretName}`,
        payload: {
            data: Buffer.from(secretValue, 'utf8'),
        },
    });

    return version.name;

}

export { getSecret, setSecret }