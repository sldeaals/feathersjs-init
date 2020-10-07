const users = require('./users/users.service.js');
const products = require('./products/products.service.js');
const notifications = require('./notifications/notifications.service.js');
const subscriptions = require('./subscriptions/subscriptions.service.js');
const push = require('./push/push.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(products);
  app.configure(notifications);
  app.configure(subscriptions);
  app.configure(push);
};
