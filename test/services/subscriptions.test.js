const assert = require('assert');
const app = require('../../src/app');

describe('\'subscriptions\' service', () => {
  it('registered the service', () => {
    const service = app.service('subscriptions');

    assert.ok(service, 'Registered the service');
  });

  it('Creates subscriptions of users to send notifications', async () => {
    await app.service('push').create({
      endpoint: 'https://fcm.googleapis.com/fcm/send/e7Vi4ajhcsA .......',
      expirationTime: 'null',
      keys: { 
        p256dh: '...........-CPsXi_e9NvnhaxpuMhn-OJ4MX6ojmckzVRts.......',
        auth: '....f6nMs30v76w....'
      }
    });
  });

  it('Updates subscriptions of users to send notifications', async () => {
    let subscription = await app.service('notifications').Model.findOne();
    if (!subscription._id)
      subscription = await app.service('push').create({
        endpoint: 'https://fcm.googleapis.com/fcm/send/e7Vi4ajhcsA .......',
        expirationTime: 'null',
        keys: { 
          p256dh: '...........-CPsXi_e9NvnhaxpuMhn-OJ4MX6ojmckzVRts.......',
          auth: '....f6nMs30v76w....'
        }
      });
    
    await app.service('subscriptions').patch(subscription._id, {
      endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/gAAAAABch......',
      keys: {
        auth: '.........',
        p256dh: '.......HgPik7lB2HxrsAhKgXrfFw-EE3hsNJD-84-PEm0gK0qnNuGVZT7vT........'
      }
    });
  });
});
