import { CollectionConfig } from 'payload/types';
import { isEditorOrCreatedBy } from '../access/isEditorOrCreatedBy';
import { isAdmin } from '../access/isAdmin';
import { country_list } from '../assets/constants/countries';
import { isEditorOrUp } from '../access/isEditorOrUp';
import { isManagerOrUpFieldLevel } from '../access/isManagerOrUp';

const Locations: CollectionConfig = {
  slug: 'locations',
  auth: false,
  admin: {
    useAsTitle: 'fullAddress',
    group: "General"
  },
  access: { // readonly as this data originates from Wallet management software.
    create: isEditorOrUp,
    read: () => true,
    update: isEditorOrCreatedBy,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'fullAddress',
      label: 'Full Address',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        placeholder: "Type full address",
      },
      access: {
        read: isManagerOrUpFieldLevel,
        update: isManagerOrUpFieldLevel,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'country',
          type: 'select',
          required: true,
          admin: {
            isClearable: true,
            isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
          },
          options: country_list,
        },
        {
          name: 'municipality',
          type: 'text',
          required: true,
          unique: false,
          admin: {
            placeholder: "Type city or same level",
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'streetName',
          label: 'Street Name',
          type: 'text',
          required: true,
          unique: false,
          admin: {
            placeholder: "Type street name",
          },
        },
        {
          name: 'buildingNr',
          label: 'Building Nr',
          type: 'text',
          required: true,
          unique: false,
          admin: {
            placeholder: "Type building number",
          },
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'geocoordinates',
          type: 'point',
          label: 'Coordinates',
          unique: false,
          access: {
            read: isManagerOrUpFieldLevel,
            update: isManagerOrUpFieldLevel,
          },
        },
        {
          name: 'locationId',
          label: 'Location system id (e.g. Google Places ID)',
          type: 'text',
          unique: true,
          admin: {
            placeholder: "Type location ID",
          },
          access: {
            read: isManagerOrUpFieldLevel,
            update: isManagerOrUpFieldLevel,
          },
        },
      ],
    },
  ],
    hooks: {
    // beforeOperation: [(args) => {...}],
    // beforeValidate: [(args) => {...}],
    // beforeDelete: [(args) => {...}],
    // beforeChange: [(args) => {...}],
    // beforeRead: [(args) => {...}],
    // afterChange: [(args) => {...}],
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

export default Locations;