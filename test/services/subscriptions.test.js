const assert = require('assert');
const app = require('../../src/app');

describe('\'subscriptions\' service', () => {
  it('registered the service', () => {
    const service = app.service('(/push)');

    assert.ok(service, 'Registered the service');
  });
});
