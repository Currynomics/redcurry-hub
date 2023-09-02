import { CollectionConfig } from 'payload/types';
import { country_list } from '../assets/constants/countries';
import { company_types } from '../assets/constants/companyTypes';
import { isEditorOrCreatedBy } from '../access/isEditorOrCreatedBy';
import { isAdmin } from '../access/isAdmin';
import { isEditorOrUp } from '../access/isEditorOrUp';
import { isManagerOrSystemFieldLevel } from '../access/isManagerOrSystem';

const Companies: CollectionConfig = {
  slug: 'companies',
  auth: false,
  admin: {
    useAsTitle: 'name',
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
      name: 'regCode',
      label: 'Registration code',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true
    },
    {
      name: 'avatarUrl',
      label: 'Avatar URL',
      type: 'text',
      required: false,
      unique: false
    },  
    {
      name: 'regCountry',
      label: 'Registered In',
      type: 'select',
      admin: {
        isClearable: true,
        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
      },
      options: country_list,
      required: true
    },
    {
      name: 'vatNumber',
      label: 'VAT Number',
      type: 'text',
    },
    {
      name: 'type',
      label: 'Company Type',
      type: 'select',
      options: company_types,
      required: true
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      hasMany: true,
      access: {
        read: isManagerOrSystemFieldLevel,
      },
    },
    {
      name: 'ubos',
      label: 'Ultimate Beneficiary Owners',
      type: 'relationship',
      relationTo: 'companies',
      hasMany: true,
      access: {
        read: isManagerOrSystemFieldLevel,
      },
    },
    {
      name: 'foundedOn',
      label: 'Founded On',
      type: 'date',
      access: {
        read: isManagerOrSystemFieldLevel,
      },
    },
    {
      name: 'website',
      label: 'Website URL',
      type: 'text',
    },
    {
      name: 'bankAccounts',
      label: 'Bank Accounts',
      type: 'relationship',
      relationTo: 'accounts',
      hasMany: true,
      access: {
        read: isManagerOrSystemFieldLevel,
      },
    }
  ],
};

export default Companies;