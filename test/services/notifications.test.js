const assert = require('assert');
const app = require('../../src/app');

describe('\'notifications\' service', () => {
  it('registered the service', () => {
    const service = app.service('notifications');

    assert.ok(service, 'Registered the service');
  });

  it('creates and processes notification', async () => {
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
  });

  it('updates and processes notification, adds user information', async () => {
    // Gets existing user if not creates a new user we can use for testing
    let user = {};
    user = await app.service('users').Model.findOne();
    if (!user._id)
      user = await app.service('users').create({
        name: 'Alfred N. Steele UPDATED',
        email: 'producttestUPDATED@example.com',
        password: 'supersecret'
      });

    // Gets existing notification if not creates a new notification we can use for testing
    let notification = {
      title: 'Testing notification update method',
      body: 'Notifications Body',
      image: 'http://localhost:8080/notifications/images/author/imageName',
      icon: 'http://localhost:8080/notifications/icons/author/iconName',
      url: 'http://localhost:8080/notifications/log/author/urlPath',
      user: user
    };
    notification = await app.service('notifications').Model.findOne();
    if (!notification._id){
      notification = await app.service('notifications').create(notification);
      // `user` has been populated
      assert.deepStrictEqual(notification.user, user);
    }

    // The notifications service call params (with the user we just created)
    notification.title = 'Testing notification update method';
    notification.body = 'UPDATED notification body';
    await app.service('notifications').patch(notification._id, notification);
  });
});
