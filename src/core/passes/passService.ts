import Pass from "../../model/passes/Pass";
import { deleteCollectionItem, findCollectionItem, updateCollectionNoUser } from "../payload/localApi";
import { PassContractService } from "../blockchain/contracts/passes/PassContractService";
import { transformToTokenMetadata } from "./transformers/egress";
import { decryptString, encryptString } from "../util/encryption";
import { checkAddress } from '../third-party/ethers/ethersService';

const COLLECTION_SLUG_PASSES = "passes"
const COLLECTION_SLUG_PASS_META = "passMetas"

const createPass = async (passId: string, passTypeCode: string, recipientWalletAddress: string) => {
    try {
        var issueMessage = "" // soft fail message (e.g. when there is missing data somewhere.)

        if(!recipientWalletAddress || !checkAddress(recipientWalletAddress)) throw Error("Missing or false recipient wallet address")
        const geneticCodeInput = {
            passId: passId,
            passTypeCode: passTypeCode,
            passOwner: recipientWalletAddress
        }

        const passSignature = createPassSignature(JSON.stringify(geneticCodeInput))
        const passMeta = await getPassMeta(passTypeCode)

        const pass: Pass = new Pass();
        pass.id = passId;
        pass.description = passMeta.description;
        pass.title = passMeta.title;
        pass.typeCode = passMeta.typeCode;
        pass.imgUrl = passMeta.imageUrl;
        pass.owner = recipientWalletAddress;
        pass.passSignature = passSignature;

        const passContractService = new PassContractService();
        const transactionHash = await passContractService.mintPass(pass);

        const contractAdr = passContractService.getContractAddress();
        // const openseaUrl = process.env.OPENSEA_NFT_URL + contractAdr + "/" + tokenId
        
        const passUpdate = {
            transactionHash: transactionHash,
            title: pass.title,
            description: pass.description,
            imgUrl: pass.imgUrl,
            signature: passSignature,
            contractAdr: contractAdr,
        }

        const res = await updatePass(passId, passUpdate)
        if(!res){
            issueMessage = "Pass created but pass collection wasn't updated. Pass ID: " + passId
            console.error("Issues in passService.createPass | issues: ", issueMessage)
        } 

        return { data: passUpdate, code: 200, message: "updated", issue: issueMessage }
    } catch (error) {
        console.error("Errors in passService.createPass | error: ", error)
        return { data: undefined, code: 400, message: error.message }
    }
}

const getPassTokenMetadata = async (req: any) => {
    try {
        const query = {
            tokenId: { // property name to filter on
                equals: req.params.id // operator to use and value to compare against
            }
        }
        const data = await findCollectionItem(COLLECTION_SLUG_PASSES, query)
        const meta = transformToTokenMetadata(data)
        return { data: meta, code: 200, message: "OK" }
    } catch (error) {
        return { data: undefined, code: 400, message: error.message }
    }
}

const createPassSignature = (input: string) =>{
    return encryptString(input, process.env.PASS_SIGNATURE_SECRET);
}

const getPassSignature = (ciphertext: string) =>{
    return decryptString(ciphertext, process.env.PASS_SIGNATURE_SECRET)
}
 
const getPassMeta = async (passTypeCode: string) =>{
    try {
        const query = {
            typeCode: { // property name to filter on
                equals: passTypeCode // operator to use and value to compare against
            }
        }
        const data = await findCollectionItem(COLLECTION_SLUG_PASS_META, query)
        return data
    } catch (error) {
        throw Error("Pass type metadata needs to be defined before pass can be created.")
    }
}

const deletePass = async (passId: string) =>{
    try {
        await deleteCollectionItem(COLLECTION_SLUG_PASSES, passId)
        return { data: "deleted", code: 200, message: "success" }
    } catch (error) {
        return { data: undefined, code: 400, message: error.message }
    }
}

const updatePass = async (passId: string, update: any) =>{
    const res = await updateCollectionNoUser(COLLECTION_SLUG_PASSES, passId, update)
    if(!res) throw new Error("Cannot update pass")
    return res
}

const findPassByTxnHash = async (txnHash: string) =>{
    return await findCollectionItem(COLLECTION_SLUG_PASSES, { transactionHash: { equals: txnHash } })
}

export { createPass, getPassTokenMetadata, deletePass, updatePass, findPassByTxnHash };