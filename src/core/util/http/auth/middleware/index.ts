// const authMiddleware = (req: any, res: any, next: any) => {
//   const authHeaderValue = req.headers.authorization;
//   const expectedAuthValue = process.env.AUTH_INTERNAL_API_KEY;
//   const internalCallValue = "floppy-dragster-cloud"

//   if(authHeaderValue && (authHeaderValue == expectedAuthValue || authHeaderValue == internalCallValue)) next()
//   else return res.status(401).send('Unauthorized');
// };

// const authenticateInternalCall = (req: any, res: any, next: any) => {
//   const authHeaderValue = req.headers.authorization;
//   const expectedAuthValue = process.env.AUTH_INTERNAL_API_KEY;
//   const internalCallValue = "floppy-dragster-cloud"

//   if(authHeaderValue && (authHeaderValue == expectedAuthValue || authHeaderValue == internalCallValue)) next()
//   else return res.status(401).send('Unauthorized');
// };

// const authenticateChainlinkCall = (req: any, res: any, next: any) =>{
//   const authHeaderValue = req.headers.authorization;
//   const expectedAuthValue = process.env.CHAINLINK_API_KEY;

//   if(authHeaderValue && (authHeaderValue == expectedAuthValue)) next()
//   else return res.status(401).send('Unauthorized');
// }



const authenticateInternalCall = (req: any, res: any, next: any) => {
  const expectedAuthValues = [
    process.env.AUTH_INTERNAL_API_KEY, 
    "floppy-dragster-cloud"
  ];

  if(checkAuthHeader(req, expectedAuthValues)) next();
  else return res.status(401).send('Unauthorized');
};

const authenticateChainlinkCall = (req: any, res: any, next: any) => {
  const expectedAuthValue = process.env.CHAINLINK_API_KEY;

  if(checkAuthHeader(req, expectedAuthValue)) next();
  else return res.status(401).send('Unauthorized');
}

function checkAuthHeader(req: any, expectedValues: string | string[]): boolean {
  const authHeaderValue = req.headers.authorization;
  
  if (!authHeaderValue) return false;
  
  if (Array.isArray(expectedValues)) {
    return expectedValues.includes(authHeaderValue);
  } else {
    return authHeaderValue == expectedValues;
  }
}

export { authenticateInternalCall, authenticateChainlinkCall }