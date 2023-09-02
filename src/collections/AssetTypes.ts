import { CollectionConfig } from 'payload/types';
import { isManagerOrUp } from '../access/isManagerOrUp';
const AssetTypes: CollectionConfig = {
  slug: 'assetTypes',
  auth: false,
  admin: {
    useAsTitle: 'title',
    group: "Configuration",
    disableDuplicate: true
  },
  access: {
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
          name: 'type',
          label: 'Type',
          type: 'text',
          required: true
        },
        {
          name: 'typeCode',
          type: 'number',
          required: false,
          admin: {
            description: 'Corresponds to type value on-chain.'
          }
        },
      ],
    },
    {
      name: 'subType',
      label: 'Sub Type',
      type: 'text',
      required: true
    },
    {
      name: 'title',
      label: 'Reference title',
      type: 'text',
      required: true,
      admin: {
        description: 'Used as the title when referenced inside other collections.'
      }
    },
    {
      name: 'id',
      label: 'ID',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'NB! use prefixed depending on type (share_, property_, cash_)'
      }
    },
  ],
};

export default AssetTypes;