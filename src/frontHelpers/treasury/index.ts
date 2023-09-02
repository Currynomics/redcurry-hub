import { GovContractService } from "../../core/blockchain/contracts/governor/GovContractService";
import { callContract } from "../../core/third-party/web3";
import { makeGetRequest } from "../../core/util/http/requester";

const govAbi = require("../../assets/artifacts/contracts/GovAbi.json");
const assetsAbi = require("../../assets/artifacts/contracts/AssetsAbi.json");
const tokenAbi = require("../../assets/artifacts/contracts/RedTokenAbi.json");

const govAdr = process.env.PAYLOAD_PUBLIC_CONTRACT_ADR_ASSETS
const assetsAdr = process.env.PAYLOAD_PUBLIC_CONTRACT_ADR_GOVERNOR
const tokenAdr = process.env.PAYLOAD_PUBLIC_CONTRACT_ADR_RED_TOKEN

const TOKEN_DENOMINATOR = 100000000
const ASSET_DENOMINATOR = 100


const getTreasuryStats = async () => {
    const response = await makeGetRequest({ url: "http://localhost:3000/custom/treasury/stats", params: {}, headers: {Authorization: 'floppy-dragster-cloud'} })
    if(response.statusCode == 200){
        return {position:response.data.position.real, napt:response.data.napt.real, supply: response.data.supply.real}
    }else return null
};

const getAllAssets = async () =>{
    const assets = await callContract(assetsAbi, assetsAdr, 'assets')
    return assets

}

const getTotalPosition = async () =>{
    try {
        console.log("getTotalPosition")
        const service = new GovContractService()
        const position = await service.getTotalPosition()
        // const position = await callContract(govAbi, govAdr, 'cashPosition')
        console.log("getTotalPosition > position: ", position)
        return position / ASSET_DENOMINATOR
    } catch (error) {
        console.log("getTotalPosition > error: ", error)
        return -1
    }
}

const getIsGovOpen = async () =>{
    const isOpen = await callContract(govAbi, govAdr, 'isOpen')
    return isOpen
}

const getNAPT = async () =>{
    // const supply = await callContract(govAbi, govAdr, 'getNAPT')
    // return supply / TOKEN_DENOMINATOR
    return -1
}

const getTotalSupply = async () =>{
    const supply = await callContract(tokenAbi, tokenAdr, 'totalSupply')
    return supply / TOKEN_DENOMINATOR
}


export {getTotalSupply, getTotalPosition, getNAPT, getTreasuryStats, getIsGovOpen}