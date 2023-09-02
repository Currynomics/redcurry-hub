import xrpl from 'xrpl';
/**
 * Tutorial: https://xrpl.org/issue-a-fungible-token.html#interactive-send_token
 * @param currencyCode 
 * @param recipientWalletAddress 
 * @param issuerWalletAddress 
 * @param currencyLimit 
 * @param transferRate 
 * @param tickSize 
 * @param domain 
 */

const initClient = async () => {
  const client = new xrpl.Client(process.env.RIPPLE_NET_URL);
  await client.connect().catch(err => {
    console.error("Error connecting to client:", err);
    throw err;
  });
  return client;
};

const sendTokens = async ({
  issuerWalletAddress,
  currencyCode,
  recipientWalletAddress,
  destinationTag = 1, // Default value
}) => {
  const client = await initClient();

  const issueQuantity = "3840"; // This could be parameterized
  const sendTokenTx = {
    TransactionType: "Payment",
    Account: issuerWalletAddress,
    Amount: {
      currency: currencyCode,
      value: issueQuantity,
      issuer: issuerWalletAddress
    },
    Destination: recipientWalletAddress,
    DestinationTag: destinationTag
  };

  const payPrepared = await client.autofill(sendTokenTx);
  const paySigned = cold_wallet.sign(payPrepared); // Make sure cold_wallet is defined
  console.log(`Sending ${issueQuantity} ${currencyCode} to ${recipientWalletAddress}...`);

  const payResult = await client.submitAndWait(paySigned.tx_blob);
  if (payResult.result.meta.TransactionResult === "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${paySigned.hash}`);
  } else {
    throw `Error sending transaction: ${payResult.result.meta.TransactionResult}`;
  }

  await client.disconnect().catch(err => console.error("Error disconnecting client:", err));
};

export { sendTokens };




/** ORIGINAL TUTORIAL CODE
const sendTokens = async (issuerWalletAddress, currencyCode, recipientWalletAddress, destinationTag, currencyLimit, transferRate, tickSize, domain) => {

  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  // Send token ----------------------------------------------------------------
  const issue_quantity = "3840"
  const send_token_tx = {
    "TransactionType": "Payment",
    "Account": issuerWalletAddress,
    "Amount": {
      "currency": currencyCode,
      "value": issue_quantity,
      "issuer": issuerWalletAddress
    },
    "Destination": recipientWalletAddress,
    "DestinationTag": destinationTag || 1 // Needed since we enabled Require Destination Tags
    // on the hot account earlier.
  }

  const pay_prepared = await client.autofill(send_token_tx)
  const pay_signed = cold_wallet.sign(pay_prepared)
  console.log(`Sending ${issue_quantity} ${currency_code} to ${hot_wallet.address}...`)
  const pay_result = await client.submitAndWait(pay_signed.tx_blob)
  if (pay_result.result.meta.TransactionResult == "tesSUCCESS") {
    console.log(`Transaction succeeded: https://testnet.xrpl.org/transactions/${pay_signed.hash}`)
  } else {
    throw `Error sending transaction: ${pay_result.result.meta.TransactionResult}`
  }

  client.disconnect()
}
**/
