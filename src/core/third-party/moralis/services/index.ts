import { decodeEventLog } from "../../web3";

const decodeStreamResponse = (streamResponse: any, eventName: string) => {
    try {
        const eventAbi = getEventAbi(streamResponse.abi, eventName)
        if (!eventAbi) throw "Cannot fund event abi in stream response for event name: " + eventName
        return decodeEventLog(eventAbi, streamResponse.logs[0]);
    } catch (error) {
        console.log("decodeStreamResponse > error: ", error)
        return false
    }
}

function getEventAbi(abi, eventName) {
    for (let i = 0; i < abi.length; i++) {
        const eventAbi = abi[i];
        if (eventAbi.name == eventName) return eventAbi
    }
    return false
}

export { decodeStreamResponse }