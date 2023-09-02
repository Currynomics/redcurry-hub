import { CollectionConfig } from 'payload/types';
import { environments } from '../assets/constants/environments';
import { blockchains } from '../assets/constants/blockchains';
import { isManagerOrUp } from '../access/isManagerOrUp';

const Wallets: CollectionConfig = {
  slug: 'contracts',
  auth: false,
  admin: {
    useAsTitle: 'name',
    group: "Configuration"
  },
  access: { // readonly as this data originates from Wallet management software.
    create: isManagerOrUp,
    read: () => true,
    update: isManagerOrUp,
    delete: isManagerOrUp,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            placeholder: "Smart contract name",
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: false,
          unique: false,
          admin: {
            placeholder: "Description and comments",
          },
        },
      ],
    },
    {
      name: 'address',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        placeholder: "Smart contract address",
      },
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
  ],
};

export default Wallets;