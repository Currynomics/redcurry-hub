import {  getSecret, setSecret } from "../../third-party/google/secret-manager";

/**
 * Securely store secrets in the secrets manager.
 * Returns the secret version name or false if setting failed.
 * @param secretName - open text key to store the secret at (used to retrieve the secret).
 * @param secretValue - decrypted secret value.
 */
const safeStoreSecret = async (secretName: string, secretValue: string) => {
    try {
        const versionName = await setSecret(secretName, secretValue)
        if (versionName) return versionName
        else return false
    } catch (error) {
        console.log("safeStoreSecret > error: ", error)
        return false
    }
}

/**
 * Securely retrieve secrets from the secred manater.
 * Returns secret value or false when error or not found
 * @param secretName - open text key used to store the secret at. 
 */
const safeRetrieveSecret = async (secretName: string) => {
    try {
        const res = await getSecret(secretName)
        if (res) return res
        else return false
    } catch (error) {
        console.log("safeRetrieveSecret > error: ", error)
        return false
    }
}

export { safeStoreSecret, safeRetrieveSecret }