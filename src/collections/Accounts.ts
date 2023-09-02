import { CollectionConfig } from 'payload/types';
import { isAdmin } from '../access/isAdmin';
import { isEditorOrUp } from '../access/isEditorOrUp';
import { isEditorOrCreatedBy } from '../access/isEditorOrCreatedBy';
const Accounts: CollectionConfig = {
  slug: 'accounts',
  auth: false,
  admin: {
    useAsTitle: 'accountNr',
    group: "General"
  },
  access: {
    create: isEditorOrUp,
    read: () => true,
    update: isEditorOrCreatedBy,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'accountNr',
      label: 'Account No',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        placeholder: "IBAN number",
      },
    },
    {
      name: 'bank',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      hasMany: false,
      filterOptions: ({ relationTo, siblingData }) => {
        // returns a Where query dynamically by the type of relationship
        if (relationTo === 'companies') {
          return {
            'type': { equals: 'bank' }
          }
        }

      }
    }
  ],
};

export default Accounts;