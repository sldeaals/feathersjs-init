const { authenticate } = require('@feathersjs/authentication').hooks;

const processProduct = require('../../hooks/process-product');

const populateProduct = require('../../hooks/populate-product');

const createAuthorNotification = require('../../hooks/create-author-notification');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [ processProduct()],
    update: [ processProduct()],
    patch: [ processProduct()],
    remove: []
  },

  after: {
    all: [ populateProduct() ],
    find: [],
    get: [],
    create: [ createAuthorNotification() ],
    update: [ createAuthorNotification() ],
    patch: [ createAuthorNotification () ],
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
