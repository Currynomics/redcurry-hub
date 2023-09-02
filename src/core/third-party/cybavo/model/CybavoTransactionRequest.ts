interface CybavoRequest {
    order_id: string;
    address: string;
    amount: string;
    contract_abi: string;
    user_id: string;
    from_address: string,
    from_address_index: number,
    ignore_gas_estimate_fail: boolean;
}

interface CybavoTransactionRequest {
    requests: Array<CybavoRequest>;
    ignore_black_list: boolean;
}

export{CybavoTransactionRequest, CybavoRequest};