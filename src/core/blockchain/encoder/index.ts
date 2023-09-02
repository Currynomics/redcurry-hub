import { dencodeAbi, encodeAbi } from "../../third-party/ethers/ethersService";


const abiEncode = (types, values) => {
    return encodeAbi(types, values)
}

const abiDecode = (types, encodedValues) => {
    return dencodeAbi(types, encodedValues)
}

export {abiEncode, abiDecode}