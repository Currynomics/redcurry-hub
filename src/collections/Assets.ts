import { CollectionConfig } from 'payload/types';
import AssetType from '../core/assets/model/enums/AssetType';
import { currencies } from '../assets/constants/currencies';
import { ownership_types } from '../assets/constants/ownershipTypes';
import { canUpdateAsset } from '../access/asset/canUpdateAsset';
import { canCreateAsset } from '../access/asset/canCreateAsset';
import AppMessage from '../components/AppMessage';
import NavCount from '../components/NavCount';
import { ShareBlock } from '../components/ShareBlock';
import assetBeforeOperationsHookValidateOperation from '../hooks/AssetBeforeOperationHookValidateOperation';
import assetAfterChangePublishAsset from '../hooks/AssetAfterChangePublishAsset';
import assetBeforeOperationsHookUpdateSource from '../hooks/AssetBeforeOperationHookUpdateSource';
import { isLoggedInFieldLevel } from '../access/isLoggedIn';
import { getAssetsMetadata } from '../core/assets/services';
import { isDistAdminFieldLevel } from '../access/isDistAdmin';
import { isAdminFieldLevel } from '../access/isAdmin';
// import TreasuryStats from '../components/TreasuryStats';
import assetBeforeOperationsHookResetSyncStatus from '../hooks/AssetBeforeOperationHookResetSyncStatus';
import { isManagerOrSystemFieldLevel } from '../access/isManagerOrSystem';
import { isSupplyManagerFieldLevel } from '../access/asset/isSupplyManager';
import { isAssetManagerFieldLevel } from '../access/asset/isAssetManager';
import { isAssetEditorFieldLevel } from '../access/asset/isAssetEditor';
import assetBeforeChangeHookConfigureField from '../hooks/AssetBeforeChangeHookConfigureField';
import assetAfterChangeBalanceSource from '../hooks/AssetAfterChangeBalanceSource';

const Assets: CollectionConfig = {
  slug: 'assets',
  auth: false,
  admin: {
    useAsTitle: 'title',
    group: "Assets",
    disableDuplicate: true
  },
  versions: {
    maxPerDoc: 0,
    drafts: false
  },
  access: {
    create: canCreateAsset,
    read: () => true,
    update: canUpdateAsset('collaborators'),
    delete: () => false
  },
  fields: [
    {
      name: 'cascade',
      type: 'number',
      hidden: true,
      defaultValue: 1,
    },
    {
      name: 'changeOperation',
      type: 'text',
      admin: {
        disabled: true
      },
    },
    // {
    //   name: 'notifNoReactive',
    //   type: 'ui',
    //   admin: {
    //     components: {
    //       Field: () => TreasuryStats({ type: "infoMsg", text: "This is a notification message", })
    //     }
    //   }
    // },
    {
      name: 'mfaReminder',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: () => AppMessage({ type: "guideMsg", text: "After Save, sign transaction with app.", subTxt: "Additional signatories may be required." })
        }
      }
    },
    {
      name: 'directMintWarnMsg',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: () => AppMessage({ type: "warnMsg", text: "New tokens will be sent directly to customer wallet." })
        },
        condition: (data, siblingData) => {
          if (data.mintDirect) return true
          return false;
        },
      }
    },
    {
      name: 'id',
      type: 'text',
      admin: {
        readOnly: true
      },
    },
    {
      name: 'navCount',
      type: 'ui',
      admin: {
        components: {
          Field: () => NavCount({ type: "infoMsg", text: "Asset NAV" })
        }
      }
    },
    {
      name: 'notSyncedWarnMsg',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: () => AppMessage({ type: "warnMsg", text: "Not synced on-chain." })
        },
        condition: (data, siblingData) => {
          if (!data.syncedOnChain) return true
          return false;
        }
      }
    },
    {
      name: 'pendingTxnMsg',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: () => AppMessage({ type: "waitMsg", text: "Waiting for other signatures & on-chain transactions.", subTxt: "Asset will auto-update in ~5min." })
        },
        condition: (data, siblingData) => {
          if (!data.txnStatus || data.txnStatus === "pending") return true
          return false;
        }
      }
    },
    {
      name: 'positionClosedWarnMsg',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: () => AppMessage({ type: "errMsg", text: "Position closed." })
        },
        condition: (data, siblingData) => {
          if (data.closePosition) return true;
          return false;
        }
      }
    },
    {
      label: 'Supply',
      type: 'collapsible', // required
      admin: {
        position: 'sidebar',
      },
      fields: [ // required
        {
          name: 'supplyChanging',
          label: 'Variable supply',
          type: 'checkbox',
          required: true,
          defaultValue: false,
          admin: {
            description: 'Will affect supply on NAV change if offset account isnt used. Cannot be edited later.',
          },
          access: {
            read: isLoggedInFieldLevel,
            create: isSupplyManagerFieldLevel,
            update: () => false // cannot be updated after creation
          },
        },
        {
          label: "Expected tokens to be issued",
          name: 'expectedSupplyDelta',
          type: 'number',
          admin: {
            description: 'Will be calculated automatically',
            readOnly: true,
            disabled: true,
            condition: (data, siblingData) => {
              if (!data.sourceAsset && data.supplyChanging) return true;
              else return false;
            }
          },
        },
        {
          name: 'customer',
          label: 'Token customer',
          type: 'relationship',
          required: false,
          relationTo: 'customers',
          admin: {
            description: 'Issued tokens recipient.',
            condition: (data, siblingData) => {
              if (data.supplyChanging && !data.sourceAsset) return true // asset affects supply
              return false;
            }
          },
          access: {
            read: isLoggedInFieldLevel,
          },
        },
        {
          name: 'mintDirect',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: "Supply directly to customer wallet.",
            condition: (data, siblingData) => {
              if ((data.supplyChanging && !data.sourceAsset) && data.customer) return true // asset affects supply and customer is selected
              return false;
            }
          },
          access: {
            read: isLoggedInFieldLevel,
            update: isDistAdminFieldLevel
          },
        },
      ]
    },
    {
      label: 'Close position (caution!)',
      type: 'collapsible', // required
      admin: {
        initCollapsed: true,
        position: 'sidebar',
        condition: (data, siblingData) => {
          if (data.id) return true; // show after asset is created
          else return false;
        }
      },
      fields: [
        {
          name: 'closePosition',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: "Closes position and burns asset on-chain (cannot be undone).",
            condition: (data, siblingData) => {
              if (data.assetType && data.assetType.includes(AssetType.PROPERTY)) return true;
              else return false;
            }
          },
          access: {
            read: isLoggedInFieldLevel,
            create: () => false,
            update: isSupplyManagerFieldLevel
          },
        },
        {
          name: 'recFromSale',
          label: 'Receivables from sale',
          type: 'number',
          min: 0,
          admin: {
            description: "Total receivables from property SALE.",
            condition: (data, siblingData) => {
              if (data.assetType && data.closePosition && data.assetType.includes(AssetType.PROPERTY)) return true;
              else return false;
            }
          },
          access: {
            read: isLoggedInFieldLevel,
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          description: 'General information about an asset.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  access: {
                    update: isAssetManagerFieldLevel
                  },
                },
                {
                  name: 'assetType',
                  label: 'Asset Type',
                  type: 'relationship',
                  required: true,
                  relationTo: 'assetTypes',
                  admin: {
                    description: '(for property SPVs, select property type)',
                  },
                  access: {
                    update: () => false // cannot be updated after creation
                  },
                },

              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  admin: {
                    description: 'Publicly visible asset description.',
                  },
                  access: {
                    update: isAssetManagerFieldLevel
                  },
                },
                {
                  name: 'comments',
                  type: 'textarea',
                  admin: {
                    description: 'Private comments and notes.',
                  },
                  access: {
                    update: isAssetManagerFieldLevel,
                    read: isAssetEditorFieldLevel,
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'location',
                  type: 'relationship',
                  relationTo: 'locations',
                  admin: {
                    condition: (data, siblingData) => {
                      if (data.assetType && data.assetType.includes(AssetType.PROPERTY)) return true;
                      else return false;
                    }
                  },
                  access: {
                    update: isAssetManagerFieldLevel
                  },
                },
                {
                  name: 'imageUrl',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => {
                      if (data.assetType && data.assetType.includes(AssetType.PROPERTY)) return true;
                      else return false;
                    }
                  },
                  access: {
                    update: isAssetManagerFieldLevel
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'custodian',
                  type: 'relationship',
                  relationTo: 'companies',
                  admin: {
                    description: 'Company directly responsible for taking care of the asset.',
                  },
                  access: {
                    update: isAssetManagerFieldLevel
                  },
                },
                {
                  name: 'creationReason',
                  label: 'Reason For Creation',
                  type: 'relationship',
                  relationTo: 'assetReasons',
                  admin: {
                    description: 'Reference why the asset was created.',
                    condition: (data, siblingData) => {
                      if (data.id) return false; // show only on-create
                      else return true;
                    }
                  },
                  access: {
                    read: isLoggedInFieldLevel,
                    update: () => false
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'extRefUrl',
                  label: 'External Reference Link',
                  type: 'text',
                  admin: {
                    description: 'URL to public resource for this asset.',
                  },
                  access: {
                    update: isAssetManagerFieldLevel
                  },
                },
                {
                  name: 'tags',
                  label: 'Tags',
                  type: 'text',
                  admin: {
                    description: 'Separate by commas.'
                  },
                  access: {
                    update: isAssetManagerFieldLevel
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Valuation',
          description: 'Value related information.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'sourceAsset',
                  label: 'Offset Account',
                  type: 'relationship',
                  relationTo: 'assets',
                  admin: {
                    description: 'Select if you dont want to affect total NAV (NAV cwill be offset from this account).',
                    // todo: add conditional logic and hide this field base on User roles.
                  },
                  access: {
                    // create: isAssetManagerFieldLevel,
                    // update: isAssetManagerFieldLevel,
                    read: isLoggedInFieldLevel,
                  },
                  filterOptions: ({ relationTo, data }) => {
                    return {
                      and: [
                        {
                          'assetType': { in: ["cash_fiat", "cash_stable"] } // cannot use non-cash as source
                        },
                        {
                          '_id': { not_equals: data.id } // cannot use self as source.
                        },
                        {
                          'tokenId': { exists: true } // must have tokeId specified
                        },
                      ]
                    }
                  },
                },
              ]
            },
            {
              name: 'shares', // required
              label: 'Transactions',
              type: 'blocks', // required
              minRows: 1,
              blocks: [ // required
                ShareBlock
              ],
              admin: {
                description: "Buy (pos) and sell (neg) transactions with shares",
                condition: (data, siblingData) => {
                  if (data.assetType && data.assetType.includes(AssetType.SHARE)) return true;
                  else return false
                }
              },
              access: {
                create: isAssetManagerFieldLevel,
                read: isLoggedInFieldLevel,
                update: isAssetManagerFieldLevel,
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
                      if (data.assetType && (data.assetType.includes(AssetType.PROPERTY))) return true;
                      else return false
                    }
                  },
                  access: {
                    create: isAssetManagerFieldLevel,
                    read: isLoggedInFieldLevel,
                    update: isAssetManagerFieldLevel,
                  },
                },
                {
                  name: 'coa',
                  label: 'Cash Position',
                  type: 'number',
                  min: 0,
                  admin: {
                    description: 'Consider as cash on account (COA)',
                    condition: (data, siblingData) => {
                      if (data.assetType && data.assetType.includes(AssetType.SHARE)) return false;
                      else return true;
                    }
                  },
                  access: {
                    read: isLoggedInFieldLevel,
                  },
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
                      if (data.assetType && (data.assetType.includes(AssetType.PROPERTY))) return true;
                      else return false
                    }
                  },
                  access: {
                    create: isAssetManagerFieldLevel,
                    read: isLoggedInFieldLevel,
                    update: isAssetManagerFieldLevel,
                  },
                },
                {
                  name: 'oavr',
                  label: 'OAV Revaluation',
                  type: 'number',
                  min: 0,
                  admin: {
                    condition: (data, siblingData) => {
                      if (data.assetType && data.assetType.includes(AssetType.PROPERTY)) return true;
                      else return false;
                    }
                  },
                  access: {
                    create: isAssetManagerFieldLevel,
                    read: isLoggedInFieldLevel,
                    update: isAssetManagerFieldLevel,
                  },
                },
              ]
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'oa',
                  label: 'Other Assets',
                  type: 'number',
                  min: 0,
                  admin: {
                    condition: (data, siblingData) => {
                      if (data.assetType && (data.assetType.includes(AssetType.PROPERTY))) return true;
                      else return false;
                    }
                  },
                  access: {
                    read: isLoggedInFieldLevel,
                  },
                },
                {
                  name: 'ral',
                  label: 'Receivables & Liabilities',
                  type: 'number',
                  admin: {
                    condition: (data, siblingData) => {
                      if (data.assetType && (data.assetType.includes(AssetType.PROPERTY))) return true;
                      else return false;
                    }
                  },
                  access: {
                    read: isLoggedInFieldLevel,
                  },
                },
              ]
            },
            {
              type: 'row',
              fields: [

                {
                  name: 'bd',
                  label: 'Bank Debt',
                  type: 'number',
                  min: 0,
                  admin: {
                    condition: (data, siblingData) => {
                      if (data.assetType && (data.assetType.includes(AssetType.PROPERTY))) return true;
                      else return false;
                    }
                  },
                  access: {
                    read: isLoggedInFieldLevel,
                  },
                },
                {
                  name: 'totalSupplyQty',
                  label: 'Total Supply',
                  type: 'number',
                  min: 0,
                  admin: {
                    condition: (data, siblingData) => {
                      if (data.assetType && data.assetType.includes(AssetType.SHARE)) return true;
                      else return false;
                    }
                  },
                  access: {
                    read: isLoggedInFieldLevel,
                  },
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
                    condition: (data, siblingData) => {
                      if (data.assetType && (data.assetType.includes(AssetType.PROPERTY))) return true;
                      else return false;
                    }
                  },
                },
                {
                  name: 'valuationUrl',
                  label: 'Link to valuation report',
                  type: 'text',
                  admin: {
                    description: 'Not published.',
                    condition: (data, siblingData) => {
                      if (data.assetType && (data.assetType.includes(AssetType.PROPERTY))) return true;
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
                  name: 'lastValueAudit',
                  label: 'Last Audit',
                  type: 'date',
                  admin: {
                    description: 'When was last audit done?',
                  }
                },
                {
                  name: 'valueAuditUrl',
                  label: 'Link to valuation audit',
                  type: 'text',
                  admin: {
                    description: 'Not published.',
                  }
                },
              ]
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
                disabled: true,
                description: 'Currently only EUR is supported.'
              }
            },
          ]
        },
        {
          label: 'Access',
          description: 'Set access control parameters.',
          fields: [
            {
              name: 'userSignature',
              label: 'Your signature',
              type: 'text',
              required: false,
              admin: {
                description: 'Sign this commit with your secret 4 words.',
              },
              access: {
                read: isLoggedInFieldLevel,
              },
            },
            {
              name: 'collaborators', // note: not to confuse with asset_manager role, this is an on-chain variable.
              label: 'Collaborators',
              type: 'relationship',
              relationTo: 'users',
              required: false,
              hasMany: true,
              admin: {
                description: "Other users who can edit or manage this asset.",
              },
              filterOptions: ({ relationTo, data, user }) => {
                return {
                  and: [
                    {
                      'wallet': { exists: true } // must have wallet assigned
                    },
                    // {
                    //   '_id': { not_equals: user.id } // cannot add self as manager.
                    // }
                  ]
                }
              },
              access: {
                create: isAssetManagerFieldLevel,
                read: isLoggedInFieldLevel,
                update: isAssetManagerFieldLevel,
              },
            },
          ]
        },
        {
          label: 'Ownership',
          description: 'Information related to asset ownership',
          fields: [
            {
              name: 'ownerhipType',
              label: 'Ownerhip Type',
              type: 'select',
              options: ownership_types,
              admin: {
                description: 'My description'
              },
              access: {
                read: () => true,
                update: isAssetManagerFieldLevel,
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'immediateOwner',
                  label: 'Immediate Owner',
                  type: 'relationship',
                  hasMany: false,
                  relationTo: 'companies',
                  admin: {
                    description: 'Immediate owner of the asset.',
                  },
                  access: {
                    read: () => true,
                    update: isAssetManagerFieldLevel,
                  },
                },
                {
                  name: 'extOwnershipRefUrl',
                  label: 'External Ownership Reference Link',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Reference to external registry (e.g. government registry).'
                  },
                  access: {
                    read: () => true,
                    update: isAssetManagerFieldLevel,
                  },
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
                  admin: {
                    description: 'Which bank accounts hold the asset.',
                    condition: (data, siblingData) => {
                      if (data.assetType && data.assetType.includes(AssetType.CASH)) return true;
                      else return false;
                    }
                  },
                },
                {
                  name: 'ownershipPercentage',
                  label: 'Percentage of ownership',
                  type: 'number',
                  min: 0,
                  max: 100,
                  required: true,
                  defaultValue: ({ data }) => (100),
                  admin: {
                    description: "How much of this asset is owned by Redcurry i.e. is backing the currency.",
                    condition: (data, siblingData) => {
                      if (data.assetType && (data.assetType.includes(AssetType.PROPERTY))) return true;
                      else return false;
                    }
                  },
                  access: {
                    read: () => true,
                    update: isAssetManagerFieldLevel,
                  },
                },
              ],
            },
          ]
        },
        {
          label: 'On-chain',
          description: 'Asset status on blockchain.',
          fields: [

            {
              type: 'row',
              fields: [
                {
                  name: 'txnHash',
                  type: 'text',
                  admin: {
                    description: 'Governor transaction hash',
                    // readOnly: true,
                  },
                  access: {
                    read: isAdminFieldLevel,
                    update: isAdminFieldLevel,
                  },
                },
                {
                  name: 'txnStateUpdatedAt',
                  label: 'State changed on',
                  type: 'number',
                  admin: {
                    description: 'When did the state change on-chain',
                    // readOnly: true,
                  },
                  access: {
                    read: isAdminFieldLevel,
                    update: isAdminFieldLevel,
                  },
                }
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'txnId',
                  type: 'text',
                  admin: {
                    description: 'Governor transaction ID',
                    // readOnly: true,
                  },
                  access: {
                    read: isManagerOrSystemFieldLevel,
                    update: isAdminFieldLevel,
                  },
                },
                {
                  name: 'syncedOnChain',
                  label: 'Synced with blockchain',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Has Asset state synced with blockchain.',
                    // readOnly: true,
                  },
                  access: {
                    read: isLoggedInFieldLevel,
                    update: isAdminFieldLevel,
                  },
                },

              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'eventId',
                  type: 'text',
                  admin: {
                    description: 'Snowflake ID of the last transaction.',
                    // readOnly: true
                  },
                  access: {
                    read: isLoggedInFieldLevel,
                    update: isAdminFieldLevel,
                  },
                },
                {
                  name: 'tokenId',
                  label: 'Token ID',
                  type: 'text',
                  admin: {
                    description: 'Asset token ID',
                    // readOnly: true,
                  },
                  access: {
                    read: () => true,
                    update: isAdminFieldLevel,
                  },
                }
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'txnStatus',
                  label: 'Transaction status',
                  admin: {
                    description: 'Transaction status on blockchain',
                    // readOnly: true,
                  },
                  type: 'text',
                  required: false,
                  defaultValue: ({ data }) => ('not started'),
                  access: {
                    read: isManagerOrSystemFieldLevel,
                    update: isAdminFieldLevel,
                  },
                },
                {
                  name: 'statusReason',
                  admin: {
                    description: 'Reason for this status.',
                    // readOnly: true,
                  },
                  type: 'textarea',
                  required: false,
                  access: {
                    read: isManagerOrSystemFieldLevel,
                    update: isAdminFieldLevel,
                  },
                },
              ]
            }
          ]
        }
      ]
    }
  ],
  endpoints: [
    {
      path: '/meta',
      method: 'post',
      handler: async (req, res, next) => {
        const response = await getAssetsMetadata(req.body.ids);
        if (response.data) {
          res.status(200).send(response.data);
        } else {
          res.status(response.code).send({ error: response.message });
        }
      }
    }
  ],
  hooks: {
    // beforeOperation: [assetBeforeOperationsHook],
    beforeOperation: [assetBeforeOperationsHookValidateOperation, assetBeforeOperationsHookResetSyncStatus],
    // beforeChange: [assetBeforeChangeHookConfigureField],
    afterChange: [assetAfterChangePublishAsset, assetAfterChangeBalanceSource] // warn: race condition inside balanceSource as its using lastSyncedAsset (when callback wins, this is last synced)
    // beforeValidate: [(args) => {...}],
    // beforeDelete: [assetBeforeDeleteHookValidateOperation, assetBeforeDeleteHookUpdateSource] // asset cannot be deleted
    // afterDelete: [],
    // beforeRead: [getAssetsFromChainHook],
    // afterChange: [assetAfterChangePublishAsset, assetAfterChangeHookUpdateSource] 
    // afterRead: [(args) => {...}],

    // // Auth-enabled hooks
    // beforeLogin: [(args) => {...}],
    // afterLogin: [(args) => {...}],
    // afterLogout: [(args) => {...}],
    // afterRefresh: [(args) => {...}],
    // afterMe: [(args) => {...}],
    // afterForgotPassword: [(args) => {...}],
  }
};

export default Assets;