const { authenticate } = require('@feathersjs/authentication').hooks;
const pushNotification = require('../../hooks/push-notification');
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ pushNotification() ],
    update: [ pushNotification() ],
    patch: [ pushNotification() ],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
