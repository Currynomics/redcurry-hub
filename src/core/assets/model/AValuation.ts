import Currency from "./enums/Currency";

abstract class AValuation {
    cashOnAccounts: number;
    otherShortTermAssets: number;
    receivables: number;
    liabilities: number;
    netAssetValue: number;
    lastValuation: Date;
    currency: Currency;
}

export default AValuation;
