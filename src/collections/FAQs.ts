import { CollectionConfig } from 'payload/types';
import { isManagerOrUp } from '../access/isManagerOrUp';
const Wallets: CollectionConfig = {
  slug: 'faqs',
  auth: false,
  admin: {
    useAsTitle: 'question',
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
      name: 'question',
      label: "Question",
      type: 'text',
      required: true,
      unique: true,
      admin: {
        placeholder: "Short and clear question a user would ask.",
      },
    },
    {
      name: 'answer',
      label: "Answer",
      type: 'textarea',
      required: true,
      admin: {
        placeholder: "Answer to the question.",
      },
    },
  ],
};

export default Wallets;