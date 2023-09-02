import { CollectionConfig } from 'payload/types';
import { isManagerOrUp } from '../access/isManagerOrUp';
const AssetReasons: CollectionConfig = {
  slug: 'assetReasons',
  auth: false,
  admin: {
    useAsTitle: 'reason',
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
          name: 'reason',
          type: 'text',
          required: true
        },
        {
          name: 'description',
          type: 'text',
          required: true
        },
      ],
    },
    
  ],
};

export default AssetReasons;