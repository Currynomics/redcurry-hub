import { CollectionConfig } from 'payload/types';
import AssetType from '../core/assets/model/enums/AssetType';
import { currencies } from '../assets/constants/currencies';
import { ownership_types } from '../assets/constants/ownershipTypes';
import { isSystemFieldLevel } from '../access/isSystem';
import { canCreateAsset } from '../access/asset/canCreateAsset';
import { ShareBlock } from '../components/ShareBlock';
import assetBeforeOperationsHook from '../hooks/AssetBeforeOperationHookValidateOperation';
import { assetEventTypes } from '../assets/constants/assetEventTypes';
const AssetsEvent: CollectionConfig = {
  // todo: exclude from Admin
  slug: 'assetsEvent',
  admin: {
    useAsTitle: 'event.eventName',
    group: "Assets",
    disableDuplicate: true
  },
  access: {
    create: canCreateAsset,
    read: () => false,
    update: () => false,
    delete: () => false
  },
  fields: [
    // {
    //   name: 'supplyWarnMsg',
    //   type: 'ui',
    //   admin: {
    //     position: 'sidebar',
    //     components: {
    //       Field: () => AppMessage({ type: "warningMsg", text: "This update will update alter the supply to maintain the peg. Select source asset to avoid supply change." })
    //     },
    //     condition: (data, siblingData) => {
    //       if (data.sourceAsset || !data.supplyChanging) return false;
    //       else return true;
    //     }
    //   }
    // },
    {
      name: 'event',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'ignoreOnChain',
              type: 'text',
              admin: {
                disabled: true,
              }
            },
            {
              name: 'eventType',
              type: 'select',
              options: assetEventTypes,
              admin: {
                description: 'Select asset event type.',
              }
            },
            {
              name: 'assetId',
              type: 'relationship',
              label: "Select asset",
              relationTo: 'assets',
              required: true,
              hasMany: false,
              admin: {
                description: ({ value }) => {
                  if (value && value.includes(AssetType.CASH)) return "Asset type Cash"
                  if (value && value.includes(AssetType.PROPERTY)) return "Asset Property"
                  if (value && value.includes(AssetType.SHARE)) return "Asset type Share"
                  return 'Which asset is this event changing?'
                },
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'eventName',
              type: 'text',
              required: true,
              admin: {
                description: 'Give this event a name.',
              }
            },
            {
              name: 'eventReason',
              label: 'Reason For Event',
              type: 'relationship',
              required: true,
              relationTo: 'assetReasons',
              admin: {
                description: 'What caused this event.',
              },
            },
          ],
        },
      ]
    },
    {
      name: 'asset', // required
      type: 'group', // required
      admin: {
        condition: (data, siblingData) => {
          if (data.event && data.event.assetId) return true;
          else return false;
        }
      },
      fields: [ // required
        {
          type: 'tabs',
          tabs: [
            {
              label: 'General',
              description: 'General asset information.',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      label: 'New title',
                      name: 'title',
                      type: 'text',
                      admin: {
                        description: 'Leave empty for no change',
                      }
                    },
                    {
                      label: 'New description',
                      name: 'description',
                      type: 'textarea',
                      admin: {
                        description: 'Leave empty for no change',
                      }
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      label: 'New image URL',
                      name: 'imageUrl',
                      type: 'text',
                      admin: {
                        description: 'Leave empty for no change',
                      }
                    },
                    {
                      label: 'New location',
                      name: 'location',
                      type: 'relationship',
                      relationTo: 'locations',
                      hasMany: false,
                      admin: {
                        description: 'Leave empty for no change',
                      }
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      label: 'New custodian',
                      name: 'custodian',
                      type: 'relationship',
                      relationTo: 'companies',
                      admin: {
                        description: 'Responsible for caring for the asset. Leave empty if no change',
                      }
                    },
                    {
                      name: 'extRefUrl',
                      label: 'New External Link',
                      type: 'text',
                      admin: {
                        description: 'Leave empty if no change',
                      }
                    },
                  ],
                },
              ],
            },
            {
              label: 'Valuation',
              description: 'Value related information.',
              fields: [
                // {
                //   name: 'navCount',
                //   type: 'ui',
                //   admin: {
                //     components: {
                //       Field: () => NavCount({ type: "infoMsg", text: "Net Asset Value: ", usage: "event" })
                //     }
                //   }
                // },
                {
                  name: 'newSharesAquired', // required
                  label: 'New Shares Aquired',
                  type: 'blocks', // required
                  minRows: 0,
                  blocks: [ // required
                    ShareBlock
                  ],
                  admin: {
                    description: "Affects OAV value.",
                    condition: (data, siblingData) => {
                      if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.SHARE)) return true;
                      else return false;
                    }
                  },
                },
                {
                  name: 'sharesSold', // required
                  label: 'Shares Sold',
                  type: 'blocks', // required
                  minRows: 0,
                  blocks: [ // required
                    ShareBlock
                  ],
                  admin: {
                    description: "Affects OAV value.",
                    condition: (data, siblingData) => {
                      if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.SHARE)) return true;
                      else return false;
                    }
                  },
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'oav',
                      label: 'Original Aquisition Value (OAV)',
                      type: 'number',
                      min: 0,
                      admin: {
                        condition: (data, siblingData) => {
                          if (data.event && data.event.assetId && (data.event.assetId.includes(AssetType.CASH) || data.event.assetId.includes(AssetType.SHARE))) return false;
                          else return true;
                        }
                      }
                    },
                    {
                      name: 'coa',
                      label: 'Cash On Account (COA)',
                      type: 'number',
                      min: 0,
                      admin: {
                        condition: (data, siblingData) => {
                          if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.SHARE)) return false;
                          else return true;
                        }
                      }
                    },
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'olta',
                      label: 'Other Long Terms Assets',
                      type: 'number',
                      min: 0,
                      admin: {
                        condition: (data, siblingData) => {
                          if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.CASH)) return false;
                          else return true;
                        }
                      }
                    },
                    {
                      name: 'osta',
                      label: 'Other Short Term Assets',
                      type: 'number',
                      min: 0,
                    },
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'oavi',
                      label: 'OAV Impairment',
                      type: 'number',
                      min: 0,
                      admin: {
                        condition: (data, siblingData) => {
                          if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.CASH)) return false;
                          else return true;
                        },
                      },
                    },
                    {
                      name: 'oavr',
                      label: 'OAV Revaluation',
                      type: 'number',
                      min: 0,
                      admin: {
                        condition: (data, siblingData) => {
                          if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.CASH)) return false;
                          else return true;
                        }
                      }
                    },
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'rec',
                      label: 'Receivables',
                      type: 'number',
                      min: 0,
                    },
                    {
                      name: 'lia',
                      label: 'Liabilities',
                      type: 'number',
                      min: 0,
                    },
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'nrOfShares',
                      label: 'Number of Shares',
                      type: 'number',
                      min: 0,
                      admin: {
                        condition: (data, siblingData) => {
                          if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.CASH)) return false;
                          else return true;
                        }
                      }
                    },
                    {
                      name: 'totalSupplyQty',
                      label: 'Total Supply',
                      type: 'number',
                      min: 0,
                      admin: {
                        condition: (data, siblingData) => {
                          if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.SHARE)) return true;
                          else return false;
                        }
                      }
                    },
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'lastValuation',
                      label: 'Last Valuation',
                      type: 'date',
                      admin: {
                        date: {
                          pickerAppearance: 'dayOnly',
                        }
                      }
                    },
                    {
                      name: 'lastValueAudit',
                      label: 'Last Audit',
                      type: 'date',
                      admin: {
                        description: 'When was last audit conducted?',
                        date: {
                          pickerAppearance: 'dayOnly',
                        }
                      }
                    },
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'valueAuditUrl',
                      label: 'Reference link to valuation audit',
                      type: 'text',
                    },
                    {
                      name: 'currency',
                      label: 'Currency',
                      type: 'select',
                      options: currencies,
                      defaultValue: ({ data }) => ('EUR'),
                      access: {
                        create: () => false,
                        update: () => false
                      },
                      admin: {
                        description: 'Currently only EUR is supported.'
                      }
                    },
                  ]
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'sourceAsset',
                      label: 'Source Asset',
                      type: 'relationship',
                      relationTo: 'assets',
                      admin: {
                        description: 'Asset NAV delta will be transferred from/to the source asset. Token supply is not affected.',
                        // todo: add condition to only select cash or no source.
                      },
                      access: {
                        update: () => false // cannot be updated after creation
                      },
                      filterOptions: ({ relationTo, siblingData, data }) => {
                        return {
                          and: [
                            {
                              'assetType': { in: ["cash_fiat", "cash_stable"] } // cannot use non-cash as source
                            },
                            {
                              '_id': { not_equals: data.event.assetId } // cannot use self as source.
                            }
                          ]
                        }
                      },
                    },
                  ],
                },
              ]
            },
            {
              label: 'Ownership',
              description: 'Information related to asset ownership',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ownerhipType',
                      label: 'Ownerhip Type',
                      type: 'select',
                      options: ownership_types,
                      admin: {
                        description: 'How is the assets ownership carried from immediate to ultimate owner (UBO - Redcurry)?'
                      }
                    },
                    {
                      name: 'immediateOwners',
                      label: 'Immediate Owner',
                      type: 'relationship',
                      relationTo: 'companies',
                      hasMany: true,
                      admin: {
                        description: 'Immediate owners of the asset.'
                      }
                    },
                  ],
                },
                {
                  name: 'ubos',
                  label: 'Ultimate Beneficiary Owners',
                  type: 'relationship',
                  relationTo: 'companies',
                  hasMany: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'qtyTotal',
                      label: 'Total Quantity (supply)',
                      type: 'number',
                      min: 0,
                      admin: {
                        description: 'Total asset supply.',
                        condition: (data, siblingData) => {
                          if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.SHARE)) return true;
                          else return false;
                        }
                      }
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'onAccounts',
                      label: 'On Bank Accounts',
                      type: 'relationship',
                      relationTo: 'accounts',
                      hasMany: true,
                      admin: {
                        description: 'Which bank accounts hold the asset.',
                        condition: (data, siblingData) => {
                          if (data.event && data.event.assetId && data.event.assetId.includes(AssetType.CASH)) return true;
                          else return false;
                        }
                      },
                    },
                    {
                      name: 'extOwnershipRefUrl',
                      label: 'External Ownership Reference Link',
                      type: 'text',
                      admin: {
                        description: 'Reference to external registry (e.g. government registry).'
                      }
                    },
                  ],
                },
              ]
            },
            {
              label: 'Commit',
              description: 'Commit asset to blockchain',
              fields: [
                {
                  name: 'userSignature',
                  label: 'Your signature',
                  type: 'text',
                  admin: {
                    description: 'Sign this commit with your secret 4 words.',
                  }
                },
                {
                  name: 'eventComment',
                  type: 'textarea',
                  admin: {
                    description: 'Describe the reason for this event.',
                  }
                },
              ]
            },
            {
              label: 'On-chain',
              description: 'Blockchain related data',
              fields: [
                {
                  name: 'txnStatus',
                  label: 'Transaction status',
                  admin: {
                    description: 'Confirms that asset is on blockchain'
                  },
                  type: 'text',
                  access: {
                    // Only admins can create or update a value for this field
                    create: isSystemFieldLevel,
                    update: isSystemFieldLevel,
                  },
                  defaultValue: ({ data }) => ('pending'),
                },
              ]
            }
          ]
        }
      ]
    }
  ],
  hooks: {
    // todo: populate assets from on-chain using the beforeOperation hook
    beforeOperation: [assetBeforeOperationsHook],
    // beforeValidate: [(args) => {...}],
    // beforeDelete: [(args) => {...}],
    //beforeChange: [dummyBeforeChangeHook], //importan: called before validate
    // beforeRead: [getAssetsFromChainHook],
    // afterChange: [publishAssetHook] // called after validate and update. Place on-chain here.
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

export default AssetsEvent;