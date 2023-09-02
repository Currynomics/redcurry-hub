import { User } from "payload/dist/auth";
import { updateCollection, updateCollectionNoUser } from "../payload/localApi";
import { decryptString, encryptString } from "../util/encryption";

// todo: use Google Secrets service in here.
const encryptUserSecret = (userSecret: string) => {
    try {
        var encryptedSecret = encryptString(userSecret, process.env.USER_SECRET_ENC_KEY)
        encryptedSecret = process.env.USER_SECRET_PREFIX + encryptedSecret
        return encryptedSecret
    } catch (error) {
        throw Error(error)
    }
}

const decryptUserSecret = (userSecretEncrypted: string) => {
    const secredWithoutPrefix = userSecretEncrypted.substring(4, userSecretEncrypted.length)
    return decryptString(secredWithoutPrefix, process.env.USER_SECRET_ENC_KEY)
}

const validateUserSecret = async (input: string, userSecretEncrypted: string) => {
    try {
        if (!userSecretEncrypted || !input) return false;
        const decrpyted = decryptUserSecret(userSecretEncrypted)
        return decrpyted === input;
    } catch (error) {
        console.log("validateUserSecretInput | error: ", error)
        return false
    }
}

const setUserSecretWords = async (userId: string, words: string, user?: User) => {
    try {
        const update = {
            userSecret: encryptUserSecret(words)
        }
        if(user) await updateCollection("users", userId, update, user)
        else await updateCollectionNoUser("users", userId, update)

        return { data: "updated", code: 200, message: "OK" }
    } catch (error) {
        return { data: undefined, code: 400, message: error.message }
    }

}
export { encryptUserSecret, validateUserSecret, setUserSecretWords }