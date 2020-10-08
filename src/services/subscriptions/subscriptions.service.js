// Initializes the `subscriptions` service on path `/(/push)`
const { Subscriptions } = require('./subscriptions.class');
const createModel = require('../../models/subscriptions.model');
const hooks = require('./subscriptions.hooks');

module.exports = function (app) {
  // Swagger Documentation
  const docs = {
    description: 'Service for Subscriptions model',
    definitions: { 
      products: { 
        $ref: '#/definitions/subscriptions',
        type: 'object',
        required: [ 'endpoint', 'expirationTime', 'keys' ],
        properties: {
          endpoint: { 
            type: 'string', description: 'https://fcm.googleapis.com/fcm/send/e7Vi4ajhcsA .......', required: true 
          },
          expirationTime: { 
            type: 'string', description: 'null' 
          },
          keys: { 
            p256dh: { type: 'string', description: '...........-CPsXi_e9NvnhaxpuMhn-OJ4MX6ojmckzVRts.......', required: true },
            auth: { type: 'string', description: '....f6nMs30v76w....', required: true }
          }
        }
      }
    }
  };

  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
    docs
  };

  // Initialize our service with any options it requires
  const subscriptions = new Subscriptions(options, app);
  subscriptions.docs = docs;
  app.use('/subscriptions', subscriptions);

  // Get our initialized service so that we can register hooks
  const service = app.service('subscriptions');
  service.hooks(hooks);
};
