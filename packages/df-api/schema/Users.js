/** *************
 *
 * User List
 * -------
 *
 */

const { Text, Checkbox, Password, Select } = require('@keystonejs/fields'); // File, Relationship;
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking } = require('@keystonejs/list-plugins');
// const { LocalFileAdapter } = require('@keystonejs/file-adapters');

const { access } = require('../utils/accessControl');

module.exports = {
  access: {
    read: access.userIsAdminOrOwner,
    update: access.userIsAdminOrOwner,
    create: true,
    delete: access.userIsAdmin,
    auth: true,
  },
  fields: {
    // Basic Auth - user fields
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
      access: ({ existingItem, authentication }) =>
        authentication.item.isAdmin || existingItem.id === authentication.item.id,
    },
    bio: { type: Text },
    favoriteFood: { type: Text },
    password: {
      type: Password,
      access: {
        read: ({ authentication }) => authentication.item.isAdmin,
        update: ({ existingItem, authentication }) =>
          authentication.item.isAdmin || existingItem.id === authentication.item.id,
      },
    },
    isAdmin: {
      type: Checkbox,
      defaultValue: false,
      access: ({ existingItem, authentication }) =>
        authentication.item.isAdmin || existingItem.id === authentication.item.id,
    },
    isBusiness: {
      type: Checkbox,
      defaultValue: false,
      access: ({ existingItem, authentication }) =>
        authentication.item.isBusiness || existingItem.id === authentication.item.id,
    },
    activeState: {
      type: Select,
      options: ['active', 'deactivated'],
      defaultValue: 'active',
    },
    // referredBy: { type: Relationship, ref: 'User' },
    lastLogin: {
      type: DateTimeUtc,
    },
    // photo: {
    //   type: File,
    //   adapter: LocalFileAdapter,
    // },
  },
  plugins: [atTracking({})],
};
