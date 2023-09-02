import web3 from 'web3'

const MORALIS_WEB3_API_KEY = process.env.MORALIS_WEB3_API_KEY

// Authentication middleware function
const moralisAuth = (req: any, res: any, next: any) => {
  try {
    console.log("moralisAuth called")
    verifySignature(req)
    next();
  } catch (error) {
    console.log("moralisAuth > error: ", error)
    res.status(401).send('Unauthorized');
  }
};

const verifySignature = (req) => {
  const providedSignature = req.headers["x-signature"]
  if (!providedSignature) throw new Error("Signature not provided")
  const generatedSignature = web3.utils.sha3(JSON.stringify(req.body) + MORALIS_WEB3_API_KEY)
  if (generatedSignature !== providedSignature) throw new Error("Invalid Signature")
  return true
}

export { moralisAuth }