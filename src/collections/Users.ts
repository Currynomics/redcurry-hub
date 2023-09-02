import { CollectionConfig } from 'payload/types';
import { user_roles } from '../assets/constants/userRoles';
import { job_roles } from '../assets/constants/jobRoles';
import { isAdmin, isAdminFieldLevel } from '../access/isAdmin';
import { isAdminOrSelf } from '../access/isAdminOrSelf';
import { asset_access_roles } from '../assets/constants/assetAccessRoles';
import CreatePasswordStrategy from '../strategies/auth/CreatePasswordStrategy';
import { services } from '../assets/constants/services';
import { setUserSecretWords } from '../core/users/userService';
import usersBeforeOperationPswValidation from '../hooks/users/UsersBeforeOperationPswValidation';
import { isManagerOrSystemFieldLevel } from '../access/isManagerOrSystem';
import { isManagerOrSelf } from '../access/isManagerOrSelf';
import { distribution_roles } from '../assets/constants/distributionRoles';
import { isLoggedInFieldLevel } from '../access/isLoggedIn';

const Users: CollectionConfig = {
  slug: 'users',
  // auth: true,
  auth: {
    maxLoginAttempts: 3,
    lockTime: 3600000 * 8, // 8 hours
    useAPIKey: true,
    forgotPassword: CreatePasswordStrategy,
    // tokenExpiration: 60 * 60 * 24 * 3, // 3 days
    // verify: true,
    // maxLoginAttempts: 5,
    // lockTime: 600 * 1000,
    // useAPIKey: true,
    // strategies: [
    //   {
    //     name: "google",
    //     strategy: GoogleStrategy,
    //   },
    // ],
  },
  access: {
    create: isAdmin,
    read: ()=> true,// isManagerOrSelf
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  endpoints: [
    {
      path: '/words',
      method: 'post',
      handler: [
        async (req, res, next) => {
          if (req.user) next()
          else res.status(401).send({ error: "unauthorized" });
        },
        async (req, res, next) => {
          const response = await setUserSecretWords(req.user.id, req.body.words);
          if (response.data) {
            res.status(200).send();
          } else {
            res.status(response.code).send({ error: response.message });
          }
        }
      ]
    },
    // {
    //   path: "/google",
    //   method: "get",
    //   handler: async (req, res) => {
    //     passport.authenticate("google", {
    //       scope: ["profile", "email"],
    //     })(req, res);
    //   },
    // },
    // {
    //   path: "/google/callback",
    //   method: "get",
    //   handler: async (req, res) => {
    //     req.payload.authenticate(req, res, () => {
    //       if (req?.user) {
    //         const final = finalise(req, res);
    //         return final.res.status(200).send({ token: final.token });
    //       }
    //       return res.status(401).send({ message: "Unauthorized" });
    //     });
    //   },
    // },
  ],
  admin: {
    useAsTitle: 'email',
    listSearchableFields: ['firstName', 'lastName', 'title'],
    group: "General"
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General', // required
          description: 'General user information',
          fields: [ // required
            {
              type: 'row',
              fields: [
                {
                  name: 'firstName',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'lastName',
                  type: 'text',
                  required: true,
                  access: {
                    read: isManagerOrSystemFieldLevel,
                  },
                },
              ],
            },
            {
              name: 'avatarUrl',
              type: 'text',
              required: false,
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'company',
                  type: 'relationship',
                  relationTo: 'companies',
                  required: false,
                  hasMany: false,
                  admin: {
                    description: 'Company this user represents / works for',
                  }
                },
                {
                  name: 'title',
                  label: 'Job title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'jobRole',
                  label: 'Job role',
                  type: 'select',
                  hasMany: false,
                  required: true,
                  options: job_roles
                },
              ],
            },
          ],
        },
        {
          label: 'On-chain', // required
          description: 'You on-chain configuration ',
          fields: [ // required
            {
              name: 'wallet',
              type: 'relationship',
              relationTo: 'wallets',
              required: false,
              hasMany: false,
              admin: {
                description: 'Wallet assigned to you for oprations.',
              },
              access: {
                read: isLoggedInFieldLevel,
                create: isAdminFieldLevel,
                update: isAdminFieldLevel,
              },
            },

          ]
        },
        {
          label: 'Access Control', // required
          description: 'Configure user access and roles',
          fields: [ // required
            {
              name: 'userSecret',
              label: 'Your secret (shown once)',
              type: 'text',
              required: true,
              access: {
                read: isManagerOrSystemFieldLevel,
                create: () => false,
                update: () => false
              },
              admin: {
                description: 'Remember this for authentication and account recovery.',
                condition: (data, siblingData) => {
                  return false
                }
              }
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'roles',
                  label: 'Access roles',
                  // Save this field to JWT so we can use from `req.user`
                  saveToJWT: true,
                  type: 'select',
                  hasMany: true,
                  access: {
                    read: isLoggedInFieldLevel,
                    create: isAdminFieldLevel,
                    update: isAdminFieldLevel,
                  },
                  admin: {
                    description: 'Manage access to backoffice resources.'
                  },
                  options: user_roles
                },
                {
                  name: 'assetRoles',
                  label: 'Assets access roles',
                  type: 'select',
                  hasMany: true,
                  access: {
                    read: isLoggedInFieldLevel,
                    create: isAdminFieldLevel,
                    update: isAdminFieldLevel,
                  },
                  options: asset_access_roles,
                  admin: {
                    description: 'Manage access to assets and supply.'
                  },
                },
                {
                  name: 'distributionRoles',
                  label: 'Supply distribution roles',
                  type: 'select',
                  hasMany: true,
                  access: {
                    read: isLoggedInFieldLevel,
                    create: isAdminFieldLevel,
                    update: isAdminFieldLevel,
                  },
                  options: distribution_roles,
                  admin: {
                    description: 'Access to distribute directly to customer (caution!)'
                  },
                },
              ],
            },
            {
              name: 'isRedcMember',
              type: 'checkbox',
              label: 'Works for Redcurry',
              defaultValue: false,
              access: {
                read: isLoggedInFieldLevel,
                create: isAdminFieldLevel,
                update: isAdminFieldLevel,
              },
            },
            {
              name: 'isFoundationMember',
              type: 'checkbox',
              label: 'Works for Foundation',
              defaultValue: false,
              access: {
                read: isLoggedInFieldLevel,
                create: isAdminFieldLevel,
                update: isAdminFieldLevel,
              },
            },
            {
              name: 'isSystem',
              type: 'checkbox',
              label: 'Service user',
              defaultValue: false,
              access: {
                read: isAdminFieldLevel,
                create: isAdminFieldLevel,
                update: isAdminFieldLevel,
              },
            },
            {
              name: 'services',
              label: 'Services User',
              type: 'select',
              hasMany: true,
              required: false,
              options: services,
              access: {
                read: isAdminFieldLevel,
                create: isAdminFieldLevel,
                update: isAdminFieldLevel,
              },
              admin: {
                description: 'Which services will be interacting as this user?',
                condition: (data, siblingData) => {
                  if (data.isSystem) return true;
                  else return false;
                }
              }
            },
          ],
        },
      ]
    }
    // Email added by default
  ],
  hooks: {
    // todo: populate assets from on-chain using the beforeOperation hook
    beforeOperation: [usersBeforeOperationPswValidation],
    // beforeValidate: [(args) => {...}],
    // beforeDelete: [(args) => {...}],
    // beforeChange: [], //importan: called before validate
    // beforeRead: [getAssetsFromChainHook],
    // afterChange: [userAfterChangeHook] // called after validate and update. Place on-chain here.
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

export default Users;