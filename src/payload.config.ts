import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Companies from './collections/Companies';
import Accounts from './collections/Accounts';
import Wallets from './collections/Wallets';
import FAQS from './collections/FAQs';
import Locations from './collections/Locations';
import Contracts from './collections/Contracts';
import PassMeta from './collections/Passmeta';
import Passes from './collections/Passes';
import AssetTypes from './collections/AssetTypes';
import Assets from './collections/Assets';
import Meta from './collections/Meta';
import Logo from './assets/graphics/Logo';
import Contacts from './collections/Contacts';
import AssetReasons from './collections/AssetReasons';
import Customers from './collections/Customers';

const walletsBeforeOperationHookEncryptDirectPath = path.resolve(__dirname, 'hooks/WalletsBeforeOperationHookEncrypt');
const assetAfterChangePublishAssetDirectPath = path.resolve(__dirname, 'hooks/AssetAfterChangePublishAsset');
const cybavoCallbackPath = path.resolve(__dirname, 'core/third-party/cybavo/callback/index')
const cybavoAuthPath = path.resolve(__dirname, 'core/third-party/cybavo/auth/index')
const fbAuthPath = path.resolve(__dirname, 'core/third-party/fireblocks/auth/index')
const fbCallbackPath = path.resolve(__dirname, 'core/third-party/fireblocks/callback/index')
const fbServicePath = path.resolve(__dirname, 'core/third-party/fireblocks/service/index')
const governorContractInteractorPath = path.resolve(__dirname, 'core/treasury/contracts/governor/GovernorContractInteractor')
const w3ProviderPath = path.resolve(__dirname, 'core/treasury/contracts/w3Provider/index');
const treasuryPath = path.resolve(__dirname, 'core/treasury/index');

const mockModulePath = path.resolve(__dirname, 'mocks/emptyObject.ts');
let disableGraphQlInProduction = true
if(process.env.DISABLE_GQL_PLAYGROUND_IN_PRODUCTION == "false") disableGraphQlInProduction = false

export default buildConfig({
  // info: set rate limits. https://payloadcms.com/docs/production/preventing-abuse
  serverURL: process.env.SERVER_URL,
  rateLimit: {
    trustProxy: true,
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    disablePlaygroundInProduction: disableGraphQlInProduction,
  },
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Redcurry',
      favicon: './assets/media/favicon.ico',
      ogImage: './assets/media/logo.png',
    },
    components: {
      graphics: {
        Logo: Logo,
        Icon: Logo
      },
    },
    webpack: (config) => ({
      ...config,
      externals: {
        './core/third-party/google/secret-manager': `() => []`,
        './core/third-party/cybavo/callback/auth': `() => []`,
        './core/third-party/cybavo/auth': `() => []`,
      },
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          util: require.resolve('util'),
          stream: require.resolve('stream-browserify'),
          fs: false,
          url: false,
          querystring: false,
          child_process: false,
          assert: false,
          tls: false,
          net: false,
          os: false
        },
        alias: {
          ...config.resolve.alias,
          [walletsBeforeOperationHookEncryptDirectPath]: mockModulePath,
          [assetAfterChangePublishAssetDirectPath]: mockModulePath,
          [cybavoCallbackPath]: mockModulePath,
          [cybavoAuthPath]: mockModulePath,
          [fbAuthPath]: mockModulePath,
          [fbCallbackPath]: mockModulePath,
          [fbServicePath]: mockModulePath,
          [governorContractInteractorPath]: mockModulePath,
          [w3ProviderPath]:mockModulePath,
          [treasuryPath]: mockModulePath
        }
      }
    })
  },
  collections: [
    Users,
    Companies,
    Accounts,
    Wallets,
    FAQS,
    Locations,
    Contracts,
    Meta,
    AssetTypes,
    Assets,
    PassMeta,
    Passes,
    Contacts,
    AssetReasons,
    Customers
    // Add Collections here
    // Examples,
  ],
  csrf: [ // whitelist of domains to allow cookie auth from, read more here https://payloadcms.com/docs/authentication/overview#csrf-protection
    'https://p01--red-bo--nnmz2tmhm4gt.code.run', // staging
    'https://admin.redcurry.co', // production
    'https://stage.admin.redcurry.co', // production
  ],
  cors: [
    'https://p01--red-bo--nnmz2tmhm4gt.code.run',
    'https://p01--backoffice-prod--nnmz2tmhm4gt.code.run',
    'https://admin.redcurry.co',
    'http://localhost:8080',
    'http://localhost:3000',
    'https://auth.redcurry.co',
    'https://redcurry-auth-app-stage.web.app',
    'https://explorer-stage.redcurry.co',
    'https://explorer.redcurry.co'
  ],
  // plugins: [googleOneTap()],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
});
