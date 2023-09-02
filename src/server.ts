import express from 'express';
import payload from 'payload';
import nodemailerSendgrid from 'nodemailer-sendgrid'
import { processTransaction } from './core/blockchain/transactions/transactionService';
import { processAssetsCommand, processCheckTreasuryState, processGetAccountDetails,  processGetContracts, processGetNAPT, processGetSupply, processGetTotalPosition, processGetTreasuryState, processGetTreasuryStateForChainlink, processGovernorCommand, processSupplyCommand } from './core/vault/controller';
import { processFireblocksCallback } from './core/third-party/fireblocks/callback';
import { authMiddleware as fireblocksAuth } from './core/third-party/fireblocks/auth';
import { authenticateChainlinkCall, authenticateInternalCall } from './core/util/http/auth/middleware';
import dotenv from 'dotenv';
import AlchemyListener from './core/third-party/alchemy/listener';
import { moralisAuth } from './core/third-party/moralis/auth';
import { processMoralisStream } from './core/third-party/moralis/controller';
dotenv.config();

let logMockCredentials = false
console.log("process.env.ENVIRON: ", process.env.ENVIRON)
if (process.env.ENVIRON == "local") logMockCredentials = true
const app = express();


const start = async () => {
  app.use(express.json())

  // Redirect root to Admin panel
  app.get('/', (_, res) => {
    res.redirect('/admin');
  });

  // Initialize Payload
  payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    email: {
      fromName: "Redcurry",
      fromAddress: "contact@redcurry.co",
      logMockCredentials: logMockCredentials,
      transportOptions: nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY,
      }),
    },
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
      payload.logger.info(`NODE_ENV: ${process.env.ENVIRON}`)
    },
  })

  const router = express.Router();
  router.get('/health', (req: any, res) => {
    res.send('Healthy')
  });

  
  router.get('/vault/accounts', authenticateInternalCall, (req: any, res) => {
    processGetAccountDetails(req, res)
  });


  // router.get('/treasury/napt', internalCallerAuth, (req: any, res) => {
    //   processGetNAPT(req, res)
    // });
    // router.get('/treasury/position', internalCallerAuth, (req: any, res) => {
      //   processGetTotalPosition(req, res)
      // });
      // router.get('/treasury/supply', internalCallerAuth, (req: any, res) => {
        //   processGetSupply(req, res)
        // })
        
  // ################### TREASURY ######################
  // ###################################################
  // chainlink
  router.get('/treasury/link', authenticateChainlinkCall, (req: any, res) => {
    processGetTreasuryStateForChainlink(req, res)
  });

  router.get('/treasury/stats', authenticateInternalCall, (req: any, res) => {
    processGetTreasuryState(req, res)
  });

  
  router.get('/treasury/supply', authenticateInternalCall, (req: any, res) => {
    processSupplyCommand(req, res)
  });
  router.get('/treasury/assets', authenticateInternalCall, (req: any, res) => {
    processAssetsCommand(req, res)
  });
  router.get('/treasury/health', authenticateInternalCall, (req: any, res) => {
    processCheckTreasuryState(req, res)
  });

  // TESTING & UTILITY
  // todo_must: remove endpoint after testing.
  router.post('/vault/test/gov', authenticateInternalCall, (req: any, res) => {
    processGovernorCommand(req, res)
  });

  router.get('/vault/contracts/whitelisted', authenticateInternalCall, (req: any, res) => {
    processGetContracts(req, res)
  });


  // CALLBACKS
  router.post('/transactions/callback', (req: any, res) => {
    processTransaction(req, res)
  });

  router.post('/fireblocks/callback', fireblocksAuth, (req: any, res) => {
    processFireblocksCallback(req, res)
  });

  router.post('/moralis/stream', moralisAuth, (req: any, res) => {
    processMoralisStream(req, res)
  });


  // Instantiate the AlchemyListener class - doesn't work
  // const alchemyListener = new AlchemyListener();

  app.use('/custom', router);
  app.listen(3000);
}

start();
