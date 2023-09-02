import { CollectionConfig } from 'payload/types';
import { isAdminFieldLevel } from '../access/isAdmin';
import { isManagerOrUp } from '../access/isManagerOrUp';

const Meta: CollectionConfig = {
  slug: 'meta',
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
          name: 'Name',
          label: 'Name this meta set',
          type: 'text',
          required: false,
        },
        {
          name: 'actual',
          label: 'This meta state will be used',
          type: 'checkbox',
          defaultValue: false,
          unique: true,
          access: {
            create: isAdminFieldLevel,
            update: isAdminFieldLevel
          },
        },
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'headerImage',
          label: 'Header image URL',
          type: 'text',
          required: false,
        },
        {
          name: 'avatarImage',
          label: 'Avatar image URL',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          label: 'Explorer main title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          label: 'Explorer sub title',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'description',
          label: 'Explorer short description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'totalNav',
          label: 'Total NAV in EUR',
          type: 'number',
          required: false,
        },
        {
          name: 'nrOfAssets',
          label: 'Nr of assets in treasury',
          type: 'number',
          required: false,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'redcurrySupply',
          label: 'Current total supply of Redcurry tokens',
          type: 'number',
          required: false,
        },
        {
          name: 'daoSupply',
          label: 'Current total supply of DAO tokens',
          type: 'number',
          required: false,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'redcurryStakingYield',
          label: 'Yearly yield of Redcurry staking (%)',
          type: 'number',
          required: false,
        },
        {
          name: 'daoStakingYield',
          label: 'Yearly yield of DAO staking (%)',
          type: 'number',
          required: false,
        },
      ],
    },
  ],
};

export default Meta;