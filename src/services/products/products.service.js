// Initializes the `products` service on path `/products`
const { Products } = require('./products.class');
const createModel = require('../../models/products.model');
const hooks = require('./products.hooks');

module.exports = function (app) {

  // Swagger Documentation
  const docs = {
    description: 'Service for Products model',
    definitions: { 
      products: { 
        $ref: '#/definitions/products',
        type: 'object',
        required: [ 'code', 'name', 'description', 'brand' ],
        properties: {
          code: {
            type: 'string',
            description: 'Product code',
            required: true
          },
          name: {
            type: 'string',
            description: 'Product name',
            required: true
          },
          description: {
            type: 'string',
            description: 'Product description',
            required: true
          },
          brand: {
            type: 'string',
            description: 'Product brand',
            required: true
          },
          author: {
            type: 'object',
            description: 'Author brand',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
            },
            allow: null
          },
          offers: {
            type: 'object',
            description: 'Offers brand',
            properties: {
              url: { type: 'string' }, priceCurrency: { type: 'string' },
              price: { type: 'string' }, priceValidUntil: { type: 'string' }, 
              itemContidion: { type: 'string' }, availability: { type: 'string' }
            },
            allow: null
          }
        }
      }
    }
  };

  // Service Options
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    docs
  };

  // Initialize our service with any options it requires
  const products = new Products(options, app);
  products.docs = docs;
  app.use('/products', products);

  // Get our initialized service so that we can register hooks
  const service = app.service('products');
  service.hooks(hooks);
};
