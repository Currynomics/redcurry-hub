import { CollectionConfig } from 'payload/types';
import { canCreateAsset } from '../access/asset/canCreateAsset';
import { canUpdateAsset } from '../access/asset/canUpdateAsset';
import { isEditorOrUp } from '../access/isEditorOrUp';
import { products } from '../assets/constants/products';
import { isAdmin } from '../access/isAdmin';
import { isManagerOrUp } from '../access/isManagerOrUp';

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
    group: "Assets",
    disableDuplicate: true
  },
  access: {
    create: canCreateAsset,
    read: isEditorOrUp,
    update: isManagerOrUp,
    delete: isAdmin
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'product',
      label: 'Product purchased',
      type: 'select',
      options: products,
      required: true,
    },
    {
      name: 'company',
      label: 'Company',
      type: 'relationship',
      required: false,
      relationTo: 'companies',
      admin: {
        description: 'If customer was company',
      },
    },
    {
      name: 'wallet',
      label: 'Recipient wallet',
      type: 'relationship',
      required: true,
      relationTo: 'wallets',
      admin: {
        description: 'Wallet receiving the product',
      },
    },
  ],
}

export default Customers;