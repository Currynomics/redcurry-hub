enum TxnStatus {
    SUCCESS = 'completed',
    FAIL = 'failed'
}

class GovOnChainTxState {
    txnId: string;
    txnHash: string;
    txnStatus: TxnStatus;
    txnSubStatus: string;
    eventId: string;
    contractAddress: string;
    statusReason: string;
    walletExtId: string;
    createdAt: number;
}

class AssetOnChainTxState {
    tokenId: number;
    syncedOnChain: boolean;
    externalId: string
}

export {GovOnChainTxState, TxnStatus, AssetOnChainTxState}