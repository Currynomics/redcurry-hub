import xrpl from 'xrpl';

/**
const cold_settings_tx = {
    "TransactionType": "AccountSet",
    "Account": issuerWalletAddress,
    "TransferRate": 0,
    "TickSize": 5,
    "Domain": "72656463757272792E636F", // "redcurry.co"
    "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
    // Using tf flags, we can enable more flags in one transaction
    "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
             xrpl.AccountSetTfFlags.tfRequireDestTag)
  }
 */

  /**
   * Tutorial: https://xrpl.org/issue-a-fungible-token.html#5-configure-hot-address-settings
   * @param issuerWalletAddress 
   * @param transferRate 
   * @param tickSize 
   * @param domain 
   */
const configureIssuer = async (issuerWalletAddress, transferRate, tickSize, domain) => {
    const client = new xrpl.Client(process.env.RIPPLE_NET_URL);
    await client.connect();

    const cold_settings_tx = {
        "TransactionType": "AccountSet",
        "Account": issuerWalletAddress,
        "TransferRate": transferRate || 0,
        "TickSize": tickSize || 5,
        "Domain": domain,
        "SetFlag": xrpl.AccountSetAsfFlags.asfDefaultRipple,
        // Using tf flags, we can enable more flags in one transaction
        "Flags": (xrpl.AccountSetTfFlags.tfDisallowXRP |
            xrpl.AccountSetTfFlags.tfRequireDestTag)
    }

    const cst_prepared = await client.autofill(cold_settings_tx)
    const cst_signed = cold_wallet.sign(cst_prepared)
    console.log("Sending cold address AccountSet transaction...")
    const cst_result = await client.submitAndWait(cst_signed.tx_blob)
    if (cst_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${cst_signed.hash}`)
    } else {
        throw `Error sending transaction: ${cst_result}`
    }

    client.disconnect()

}

export { configureIssuer }