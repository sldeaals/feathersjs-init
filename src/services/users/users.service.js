// Initializes the `users` service on path `/users`
const { Users } = require('./users.class');
const createModel = require('../../models/users.model');
const hooks = require('./users.hooks');

module.exports = function (app) {

  // Swagger Documentation
  const docs = {
    description: 'Service for user model',
    definitions: { 
      users: { 
        $ref: '#/definitions/users',
        type: 'object',
        required: [ 'name', 'email', 'password' ],
        properties: {
          name: {
            type: 'string',
            description: 'User name',
            required: true
          },
          email: {
            type: 'string',
            description: 'User email',
            required: true
          },
          password: {
            type: 'string',
            description: 'User password',
            required: true
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
  const users = new Users(options, app);
  users.docs = docs;
  app.use('/users', users);

  // Get our initialized service so that we can register hooks
  const service = app.service('users');
  service.hooks(hooks);
};
