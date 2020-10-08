// Initializes the `notifications` service on path `/notifications`
const { Notifications } = require('./notifications.class');
const createModel = require('../../models/notifications.model');
const hooks = require('./notifications.hooks');

module.exports = function (app) {
  // Swagger Documentation
  const docs = {
    description: 'Service for Subscriptions model',
    definitions: { 
      products: { 
        $ref: '#/definitions/notifications',
        type: 'object',
        required: [ 'endpoint', 'expirationTime', 'keys' ],
        properties: {
          title: { 
            type: 'string', description: 'Subject', required: true 
          },
          body: { 
            type: 'string', description: 'Notifications body text', required: true 
          },
          image: { 
            type: 'string', description: 'Image URL' 
          },
          icon: { 
            type: 'string', description: 'Icon URL'
          },
          url: { 
            type: 'string', description: 'URL to redirect after notification click' 
          },
          user: { 
            type: 'string', description: 'Object ID of user', required: true
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
  const notifications = new Notifications(options, app);
  notifications.docs = docs;
  app.use('/notifications', notifications);

  // Get our initialized service so that we can register hooks
  const service = app.service('notifications');
  service.hooks(hooks);
};
