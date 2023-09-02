import { ethers } from "ethers";

const encodeAbi = (typesArray, valuesArray) =>{
    if (typesArray.length != valuesArray.length) throw new Error("types and values array length doesn't match")
    const abiCoder = ethers.utils.defaultAbiCoder
    return abiCoder.encode(typesArray, valuesArray);
}

const dencodeAbi = (typesArray, encodedValues) =>{
    const abiCoder = ethers.utils.defaultAbiCoder
    return abiCoder.decode(typesArray, encodedValues);
}
const checkAddress = (address: string)=> {
    return ethers.utils.isAddress(address); // returns boolean
}



export {checkAddress, encodeAbi, dencodeAbi}