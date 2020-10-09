const assert = require('assert');
const app = require('../../src/app');

describe('\'push\' service', () => {
  it('registered the service', () => {
    const service = app.service('push');

    assert.ok(service, 'Registered the service');
  });

  it('Pushes notification', async () => {
    // Gets existing notification if not creates a new notification we can use for testing
    let notification = {};
    notification = await app.service('notifications').Model.findOne();
    if (!notification._id){
      // Create a new user we can use for testing
      const user = await app.service('users').create({
        name: 'Alfred N. Steele',
        email: 'producttest@example.com',
        password: 'supersecret'
      });

      const notification = await app.service('notifications').create({
        title: 'Testing notification create method',
        body: 'Notifications Body',
        image: 'http://localhost:8080/notifications/images/author/imageName',
        icon: 'http://localhost:8080/notifications/icons/author/iconName',
        url: 'http://localhost:8080/notifications/log/author/urlPath',
        user: user._id
      });

      // `user` has been populated
      assert.deepStrictEqual(notification.user, user);
    }

    const createdPush = await app.service('push').create({
      notification: notification._id
    });

    // `notification` has been populated
    assert.deepStrictEqual(createdPush.notification, notification);
  });
});
