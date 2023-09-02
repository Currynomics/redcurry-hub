import { CollectionConfig } from 'payload/types';
import { isAdmin, isAdminFieldLevel } from '../access/isAdmin';
import { isAdminOrMembershipManager } from '../access/isAdminOrMembershipManager';
import { types } from '../assets/constants/passTypes';
import passAfterChangeHook from '../hooks/PassAfterChangeHook';
import passesBeforeOperationHook from '../hooks/PassesBeforeOperationHook';
import { getPassTokenMetadata } from '../core/passes/passService';
const Passes: CollectionConfig = {
  slug: 'passes',
  auth: false,
  admin: {
    useAsTitle: 'title',
    group: "Memberships",
    disableDuplicate: true
  },
  access: { // readonly as this data originates from Wallet management software.
    create: isAdminOrMembershipManager,
    read:  isAdminOrMembershipManager,
    update: isAdmin,
    delete: () => false,
  },
  fields: [
    {
      name: 'userSignature',
      label: 'Your signature',
      type: 'text',
      required: true,
      admin: {
        description: 'Sign this transaction with your secret 4 words.',
        condition: (data, siblingData) => {
          if (data.id) { // pass created, don't ask
            return false;
          } else {
            return true;
          }
        }
      }
    },
    {
      type: 'row',
      fields: [
        // Add hidden field (title + ID)
        // add hidden field extId (auto incremental)
        {
          name: 'typeCode',
          label: 'Pass type',
          type: 'select',
          options: types,
          required: true,
          admin: {
            description: 'Membership pass type'
          },
          access: {
            update: () => false
          },
        },
        {
          name: 'recipient',
          type: 'relationship',
          relationTo: 'contacts',
          required: true,
          hasMany: false,
          admin: {
            description: 'Who will receive this membership.'
          },
          access: {
            update: () => false
          },
        },
        // {
        //   name: 'recipient',
        //   label: 'Recipient address',
        //   type: 'text',
        //   required: true,
        //   admin: {
        //     description: 'ERC20 wallet address'
        //     // todo: add field validation for 0x address
        //   },
        //   validate: async (val, { operation }) => {
        //     if(checkAddress(val)) return true
        //     else return "Address invalid"
        //   },
        // },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          label: 'Pass Name',
          type: 'text',
          access: {
            create: () => false,
            update: isAdminFieldLevel
          },
        },
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          access: {
            create: () => false,
            update: isAdminFieldLevel
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'imgUrl',
          label: 'Image URL',
          type: 'text',
          access: {
            create: () => false,
            update: isAdminFieldLevel
          },
        },
        {
          name: 'signature',
          label: 'Validity signature',
          type: 'text',
          admin: {
            description: 'Use to validate on-chain pass'
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'transactionHash',
          type: 'text',
          admin: {
            description: 'On-chain hash'
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'isMinted',
          type: 'checkbox', // required
          defaultValue: false,
          admin: {
            description: 'Is minted on blockchain'
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'id',
          label: 'Pass ID',
          type: 'text',
          admin: {
            description: 'Off-chain ID'
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'tokenId',
          label: 'Token ID (on-chain)',
          type: 'text',
          admin: {
            description: 'On-chain ID'
          },
          access: {
            create: () => false,
            update: isAdminFieldLevel
          },
        }
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contractAdr',
          label: 'Contract address',
          type: 'text',
          admin: {
            description: 'NFT contract'
          },
          access: {
            create: () => false,
            update: () => false,
          },
        },
        {
          name: 'openseaUrl',
          label: 'Opensea Link',
          type: 'text',
          access: {
            create: () => false,
            update: () => false,
          },
        }
      ],
    },

  ],
  endpoints: [
    {
      path: '/token/:id',
      method: 'get',
      handler: async (req, res, next) => {
        const response = await getPassTokenMetadata(req);
        if (response.data) {
          res.status(200).send(response.data);
        } else {
          res.status(response.code).send({ error: response.message });
        }
      }
    }
  ],
  hooks: {
    beforeOperation: [passesBeforeOperationHook],  // todo_must: restore when args.req.user is defined in production (as-is: not)
    // beforeValidate: [(args) => {...}],
    // beforeDelete: [(args) => {...}],
    // beforeChange: [(args) => {...}], //importan: called before validate
    // beforeRead: [getAssetsFromChainHook],
    afterChange: [passAfterChangeHook] // called after validate and update. Place on-chain here.
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

export default Passes;