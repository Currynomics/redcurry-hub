import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isAdminOrMembershipManager } from '../access/isAdminOrMembershipManager';
import { checkAddress } from '../core/third-party/ethers/ethersService';
const Contacts: CollectionConfig = {
  slug: 'contacts',
  auth: false,
  admin: {
    useAsTitle: 'email',
    group: "Memberships"
  },
  access: {
    create: isAdminOrMembershipManager,
    read: isAdminOrMembershipManager,
    update: isAdminOrMembershipManager,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          label: 'Contact email',
          type: 'text',
          unique: true,
          required: true,
        },
        {
          name: 'walletAddress',
          label: 'Wallet address',
          type: 'text',
          unique: true,
          required: true,
          admin: {
            description: 'ERC20 wallet address'
          },
          validate: async (val, { operation }) => {
            if (checkAddress(val)) return true
            else return "Address invalid"
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          label: 'First Name',
          type: 'text',
        },
        {
          name: 'lastName',
          label: 'Last Name',
          type: 'text',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'telegramUsername',
          label: 'Telegram',
          type: 'text',
        },
        {
          name: 'discordUsername',
          label: 'Discrod',
          type: 'text',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'leadCapturedOn',
          label: 'Lead captured on',
          type: 'text',
          admin: {
            description: 'Where did lead come from.'
          },
        },
        {
          name: 'notes',
          label: 'Notes',
          type: 'textarea',
        },
      ],
    },
  ],
};

export default Contacts;