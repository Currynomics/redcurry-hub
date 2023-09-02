const Web3 = require('web3');

let web3 = new Web3(new Web3.providers.HttpProvider(process.env.PAYLOAD_PUBLIC_INFURA_NETWORK_URL));
web3.eth.handleRevert = true

const callContract = async (abi, address, methodName) => {
    try {
        const contract = new web3.eth.Contract(abi, address);
        const result = await contract.methods[methodName]().call();
        return result;
    } catch (error) {
        console.error('web3 | callContract > error:', error);
        console.log(JSON.stringify(error))
        return null;
    }
}

const decodeEventLog = (eventABI, log) => {
    const topics = [
        log.topic0, log.topic1, log.topic2, log.topic3
    ]
    const decodedLog = web3.eth.abi.decodeLog(
        eventABI.inputs,
        log.data,
        topics // todo?: Remove the first topic, as it is the event signature
    );
    return decodedLog
}

export { decodeEventLog, callContract }