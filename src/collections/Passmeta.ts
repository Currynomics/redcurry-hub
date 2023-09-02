import { CollectionConfig } from 'payload/types';
import { isAdminOrMembershipManager } from '../access/isAdminOrMembershipManager';
const PassMeta: CollectionConfig = {
  slug: 'passMetas',
  auth: false,
  admin: {
    useAsTitle: 'title',
    group: "Configuration"
  },
  access: { // readonly as this data originates from Wallet management software.
    create: isAdminOrMembershipManager,
    read: () => true,
    update: isAdminOrMembershipManager,
    delete: isAdminOrMembershipManager,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          label: 'Pass title',
          type: 'text',
          unique: true,
          required: true,
          admin: {
            description: 'Client will see this value'
          }
        },
        {
          name: 'typeCode',
          label: 'Pass type code',
          type: 'text',
          required: true,
          unique: true,
        },
      ]
    },
    {
      name: 'description',
      label: 'Pass description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Client will see this value'
      }
    },
    {
      name: 'imageUrl',
      label: 'Image URL',
      admin: {
        description: 'URL pointing to generic image representing this pass',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'maxSupply',
      label: 'Max supply',
      type: 'number',
      required: true,
    },
    {
      name: 'canSupplyChange',
      type: 'checkbox',
      label: 'Supply can change',
      defaultValue: false,
    },
  ],
};

export default PassMeta;