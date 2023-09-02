import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { environments } from '../assets/constants/environments';
import { blockchains } from '../assets/constants/blockchains';
import { getPublicWallets } from '../core/wallets/services';
import { checkAddress } from '../core/third-party/ethers/ethersService';
import { isManagerOrUp, isManagerOrUpFieldLevel } from '../access/isManagerOrUp';
import { isAdminOrCreatedBy } from '../access/isAdminOrCreatedBy';
import { walletProviders } from '../assets/constants/walletProviders';
import WalletProvider from '../core/wallets/model/enums/WalletProvider';
const Wallets: CollectionConfig = {
  slug: 'wallets',
  auth: false,
  admin: {
    useAsTitle: 'name',
    group: "General"
  },
  access: {
    create: isManagerOrUp,
    read: () => true,
    update: isAdminOrCreatedBy,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          description: 'General information about the wallet.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'address',
                  label: 'Wallet address',
                  type: 'text',
                  required: true,
                  unique: true,
                  admin: {
                    description: 'ERC20 wallet address'
                  },
                  validate: async (val, { operation }) => {
                    if (checkAddress(val)) return true
                    else return "Invalid wallet address"
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'blockchain',
                  // Save this field to JWT so we can use from `req.user`
                  type: 'select',
                  hasMany: false,
                  options: blockchains
                },
                {
                  name: 'environment',
                  // Save this field to JWT so we can use from `req.user`
                  type: 'select',
                  hasMany: false,
                  options: environments
                },
              ],
            },
            {
              name: 'tag',
              type: 'text',
              required: false,
              admin: {
                placeholder: "Tag",
              },
            },
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
            },
          ]
        },
        {
          label: 'Provider',
          description: 'Wallet provider information',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'externalName',
                  label: "Wallet Name",
                  type: 'text',
                  access: {
                    read: isManagerOrUpFieldLevel,
                  },
                  admin: {
                    placeholder: "Wallet/Vault name at provider",
                  },
                },
                {
                  name: 'externalId',
                  label: "Wallet ID",
                  type: 'text',
                  required: true,
                  unique: true,
                  access: {
                    read: isManagerOrUpFieldLevel,
                  },
                  admin: {
                    placeholder: "Wallet ID at provided.",
                  },
                },
              ]
            },

            {
              type: 'row',
              fields: [
                {
                  name: 'provider',
                  label: "Wallet provider",
                  type: 'select',
                  options: walletProviders,
                  required: true,
                },
                {
                  name: 'externalVaultId',
                  label: "Vault ID",
                  type: 'text',
                  required: false,
                  access: {
                    read: isManagerOrUpFieldLevel,
                  },
                  admin: {
                    placeholder: "Fireblocks vault id.",
                    condition: (data, siblingData) => {
                      if (data.provider == WalletProvider.FIREBLOCKS) return true;
                      else return false;
                    }
                  },
                },
              ]
            },
          ]
        }
      ]
    },
  ],
  endpoints: [
    {
      path: '/source/enriched/all',
      method: 'get',
      handler: async (req, res, next) => {
        const response = await getPublicWallets();
        if (response.data) {
          res.status(200).send({ wallets: response.data });
        } else {
          res.status(response.code).send({ error: response.message });
        }
      }
    }
  ],
  hooks: {
    // beforeOperation: [walletsBeforeOperationHookEncrypt], // not necessary with fireblocks
    // beforeValidate: [(args) => {...}],
    // beforeDelete: [(args) => {...}],
    // beforeChange: [(args) => {...}],
    // beforeRead: [(args) => {...}],
    // afterChange: [(args) => {...}],
    // afterRead: [(args) => {...}],
    // afterDelete: [(args) => {...}],

    // // Auth-enabled hooks
    // beforeLogin: [(args) => {...}],
    // afterLogin: [(args) => {...}],
    // afterLogout: [(args) => {...}],
    // afterRefresh: [(args) => {...}],
    // afterMe: [(args) => {...}],
    // afterForgotPassword: [(args) => {...}],
  },

};

export default Wallets;