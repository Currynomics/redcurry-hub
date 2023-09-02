import { Block } from "payload/types";

export const ShareBlock: Block = {
    slug: 'Share', // required
    fields: [ // required
        {
            name: 'nrOfParts',
            type: 'number',
            required: true,
            admin: {
                description: "Shares bought (pos) or sold (neg)."
            },
            // access: {
            //     update:() => false
            // }
        },
        {
            name: 'pricePerPart',
            type: 'number',
            min: 0.00001,
            required: true,
            admin: {
                description: "Share price at transaction"
            },
            // access: {
            //     update:() => false
            // }
        },
    ]
};