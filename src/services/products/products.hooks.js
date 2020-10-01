/*
const validate = require('feathers-joi');
const joiOptions = { abortEarly: false };
const schemas = require('./../products/products.schemas');
*/
const { authenticate } = require('@feathersjs/authentication').hooks;

const processProduct = require('../../hooks/process-product');

const populateProduct = require('../../hooks/populate-product');

const patchProduct = require('../../hooks/patch-product');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [ /*validate(schemas.createProduct, joiOptions), */processProduct()],
    update: [ /*validate(schemas.updateProduct, joiOptions), */patchProduct()],
    patch: [ /*validate(schemas.updateProduct, joiOptions), */patchProduct()],
    remove: []
  },

  after: {
    all: [populateProduct()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
