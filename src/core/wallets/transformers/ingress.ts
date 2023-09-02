import Wallet from "../../../model/wallets/Wallet"
import payload from 'payload'

const transform = async (walletList) => {
  try {
    const wallets: Array<Wallet> = []
    for (let i = 0; i < walletList.length; i++) {
      const listItem = walletList[i];
      const wallet: Wallet = await convertToWallet(listItem)
      wallet?wallets.push(wallet): void 0;
    }
    return wallets;
  } catch (error) {
    console.error(error.message);
    throw Error('Cannot transform listWallet to Wallets. Check transformer logs.')

  }
}

const convertToWallet = async (listItem) => {
  try {
    const wallet: Wallet = new Wallet(listItem.address)
    const meta = await getWalletMetadata(wallet.address);
    wallet.assignedUserName = meta.userName;
    wallet.assignedCompanyName = meta.companyName;
    wallet.name = meta.walletName;
    wallet.assignedUserRole = meta.userRole;
    return wallet;
  } catch (error) {
    console.error("convertToWallet | failed | error: ", error.message)
  }
}


const getWalletMetadata = async (walletAddress: string) => {
  // Find wallet
  const wallet = await payload.find({
    collection: 'wallets',
    where: {
      address: {
        equals: walletAddress,
      },
    },
  });
  if (wallet.docs.length == 0) throw Error("getWalletMetadata -> no wallet found")
  const walletName = wallet.docs[0].name;

  var userName = ""
  if(wallet.docs[0].user) userName = wallet.docs[0].user.firstName + " " + wallet.docs[0].user.lastName;
  const role = wallet.docs[0].user.role;
  var companyName = ""
  if (wallet.docs[0].user.company) companyName = wallet.docs[0].user.company.name;

  return {
    userName: userName,
    userRole: role,
    walletName: walletName,
    companyName: companyName
  }

}

export { transform }