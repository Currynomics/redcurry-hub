import xrpl from 'xrpl';

const initClient = async () => {
  const client = new xrpl.Client(process.env.RIPPLE_NET_URL);
  await client.connect().catch(err => {
    console.error("Error connecting to client:", err);
    throw err;
  });
  return client;
};

/**
 * Tutorial: https://xrpl.org/issue-a-fungible-token.html#7-create-trust-line-from-hot-to-cold-address
 * @param currencyCode note that XRPL has 3 char limit for code (use RED)
 * @param recipientWalletAddress 
 * @param issuerWalletAddress 
 * @param currencyLimit 
 * @param transferRate 
 * @param tickSize 
 * @param domain 
 */
const createTrustLine = async ({ currencyCode, recipientWalletAddress, issuerWalletAddress, currencyLimit = "10000000000" }) => {
  const client = await initClient();

  const trustSetTx = {
    TransactionType: "TrustSet",
    Account: recipientWalletAddress,
    LimitAmount: {
      currency: currencyCode,
      issuer: issuerWalletAddress,
      value: currencyLimit
    }
  };

  const tsPrepared = await client.autofill(trustSetTx);
  const tsSigned = hot_wallet.sign(tsPrepared);
  console.log("Creating trust line from hot address to issuer...");

  const tsResult = await client.submitAndWait(tsSigned.tx_blob);
  if (tsResult.result.meta.TransactionResult === "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${tsSigned.hash}`);
  } else {
    throw `Error sending transaction: ${tsResult.result.meta.TransactionResult}`;
  }

  await client.disconnect().catch(err => console.error("Error disconnecting client:", err));
};

/**
 * Tutorial: https://xrpl.org/issue-a-fungible-token.html#interactive-confirm_balances
 * @param currencyCode 
 * @param recipientWalletAddress 
 * @param issuerWalletAddress 
 * @param currencyLimit 
 */
const checkBalances = async ({ currencyCode, recipientWalletAddress, issuerWalletAddress }) => {
  const client = await initClient();

  console.log("Getting recipient address balances...");
  const recipientBalances = await client.request({
    command: "account_lines",
    account: recipientWalletAddress,
    ledger_index: "validated"
  });
  console.log(recipientBalances.result);

  console.log("Getting issuer address balances...");
  const issuerBalances = await client.request({
    command: "gateway_balances",
    account: issuerWalletAddress,
    ledger_index: "validated",
    hotwallet: [recipientWalletAddress]
  });
  console.log(JSON.stringify(issuerBalances.result, null, 2));

  await client.disconnect().catch(err => console.error("Error disconnecting client:", err));
};

export { createTrustLine, checkBalances };



// ##########################   ORIGINAL FROM TUTORIAL  ###################################3
/*
const createTrustLine = async (currencyCode, recipientWalletAddress, issuerWalletAddress, currencyLimit) => {

    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    // Create trust line from hot to cold address --------------------------------
    const currency_code = currencyCode
    const trust_set_tx = {
        "TransactionType": "TrustSet",
        "Account": recipientWalletAddress,
        "LimitAmount": {
            "currency": currency_code,
            "issuer": issuerWalletAddress,
            "value": currencyLimit || "10000000000" // Large limit, arbitrarily chosen
        }
    }


    const ts_prepared = await client.autofill(trust_set_tx)
    const ts_signed = hot_wallet.sign(ts_prepared)
    console.log("Creating trust line from hot address to issuer...")
    const ts_result = await client.submitAndWait(ts_signed.tx_blob)
    if (ts_result.result.meta.TransactionResult == "tesSUCCESS") {
        console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${ts_signed.hash}`)
    } else {
        throw `Error sending transaction: ${ts_result.result.meta.TransactionResult}`
    }

    client.disconnect()

}

const checkBalances = async (currencyCode, recipientWalletAddress, issuerWalletAddress, currencyLimit) => {

    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    // Check balances ------------------------------------------------------------
    console.log("Getting recipient address balances...")
    const recipient_balances = await client.request({
        command: "account_lines",
        account: recipientWalletAddress,
        ledger_index: "validated"
    })
    console.log(recipient_balances.result)

    console.log("Getting issuer address balances...")
    const issuer_balances = await client.request({
        command: "gateway_balances",
        account: issuerWalletAddress,
        ledger_index: "validated",
        hotwallet: [recipientWalletAddress]
    })
    console.log(JSON.stringify(issuer_balances.result, null, 2))

    client.disconnect()
}
*/