const crypto = require('crypto');
import CryptoJS from 'crypto-js';
import randomWords from 'random-words'

const encryptString = (input: string, key: string, prefix?: string) => {
    if (!input) throw new Error("encryptString missing required param - input.")
    var ciphertext = CryptoJS.AES.encrypt(input, key).toString();
    if (prefix) return prefix + ciphertext
    else return ciphertext;
}

const decryptString = (ciphertext: string, key: string, prefix?: string) => {
    let ciphertextActual = ciphertext
    if (prefix) ciphertextActual = ciphertext.replace(prefix, "")
    var bytes = CryptoJS.AES.decrypt(ciphertextActual, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

const generateRandomWords = (nrOfWords: number, separator?: string) => {
    if(separator) return randomWords(nrOfWords).toString().replaceAll(",", separator);
    else return randomWords(nrOfWords).toString().replaceAll(",", " ");
}

const generateRandomString = (length: number, caseSensitive?: boolean) => {
    let charset
    if (caseSensitive) charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    else charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        result += charset[randomBytes[i] % charset.length];
    }
    return result;
}

export { encryptString, decryptString, generateRandomWords, generateRandomString }