import { getNftMetadata } from "../../../third-party/alchemy/nftService";

/**
 * 
 * @returns Get governor token metadaa
 */
const getGovernorMeta = async () => {
    try {
        const response = await getNftMetadata(process.env.CONTRACT_ADR_GOVERNOR, process.env.TOKEN_ID_GOVERNOR);
        if(!response) return {data: undefined, code: 404, message: "NOT FOUND"}
        // todo: transform once governor contract is developed
        return {data: response, code: 200, message: "OK"}
    } catch (error) {
        return {data: undefined, code: 400, message: error.message}
    }
}


export { getGovernorMeta};
