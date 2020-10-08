// Initializes the `push` service on path `/push`
const { Push } = require('./push.class');
const createModel = require('../../models/push.model');
const hooks = require('./push.hooks');

module.exports = function (app) {
  // Swagger Documentation
  const docs = {
    description: 'Service for Push model',
    definitions: { 
      products: { 
        $ref: '#/definitions/push',
        type: 'object',
        required: [ 'notification' ],
        properties: {
          notification: { 
            type: 'string', description: 'Object ID of the pushed notification', required: true 
          },
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
  const push = new Push(options, app);
  push.docs = docs;
  app.use('/push', push);

  // Get our initialized service so that we can register hooks
  const service = app.service('push');
  service.hooks(hooks);
};
