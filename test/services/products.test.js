const assert = require('assert');
const app = require('../../src/app');

describe('\'products\' service', () => {
  it('registered the service', () => {
    const service = app.service('products');

    assert.ok(service, 'Registered the service');
  });

  it('creates and processes product, adds user information', async () => {
    // Create a new user we can use for testing
    const user = await app.service('users').create({
      name: 'Alfred N. Steele',
      email: 'producttest@example.com',
      password: 'supersecret'
    });

    // The products service call params (with the user we just created)
    const params = { user };
    const product = await app.service('products').create({
      code: '0001ERT8RE8T9UR',
      name: 'Adrenaline Rush',
      description: 'A feeling of excitement, stimulation and enhanced physical ability produced when the body secretes large amounts of adrenaline in response to a sudden perceived or induced stress situation',
      image: [
        '${url}/adrenalineRush/frontSide', 
        '${url}/adrenalineRush/rightSide', 
        '${url}/adrenalineRush/leftSide',
        '${url}/adrenalineRush/backSide'
      ],
      brand: {
        '@type': 'Brand',
        'name': 'Pepsi'
      },
      author: {
        '@type': 'Person',
        'id': '1',
        'name': 'Alfred N. Steele'
      },
      review: {
        '@type': 'Review',
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '4',
          'bestRating': '5'
        },
        'author': {
          '@type': 'Person',
          'name': 'Joan Crawford'
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        'ratingValue': '4',
        'reviewCount': '80'
      },
      offers: {
        '@type': 'Offer',
        'url': '${url}/adrenalineRush',
        'priceCurrency': 'RUB',
        'price': '130.00',
        'priceValidUntil': '2020-09-30',
        'itemContidion': '${url}/UsedCondition',
        'availability': '${url}/InStock'
      }
    }, params);

    assert.strictEqual(product.code, '0001ERT8RE8T9UR');
    assert.strictEqual(product.name, 'Adrenaline Rush');
    // `userId` should be set to passed users it
    assert.strictEqual(product.author.id, user._id);
    assert.strictEqual(product.author.name, user._name);
    // Additional(review,aggregateRating) property has been removed
    assert.ok(!product.review);
    assert.ok(!product.aggregateRating);
    // `user` has been populated
    assert.deepStrictEqual(product.user, user);
  });

  it('updates and processes product, adds user information', async () => {
    // Create a new user we can use for testing
    const user = await app.service('users').create({
      name: 'Alfred N. Steele UPDATED',
      email: 'producttestUPDATED@example.com',
      password: 'supersecret'
    });

    // Id of the product to update
    const _id = '0001ERT8RE8T9UR';

    // The products service call params (with the user we just created)
    const params = { user };
    const product = await app.service('products').patch(_id, {
      code: '0001ERT8RE8T9UR',
      name: 'Adrenaline Rush UPDATED',
      description: 'A feeling of excitement, stimulation and enhanced physical ability produced when the body secretes large amounts of adrenaline in response to a sudden perceived or induced stress situation',
      image: [
        '${url}/adrenalineRush/frontSide', 
        '${url}/adrenalineRush/rightSide'
      ],
      brand: {
        '@type': 'Brand',
        'name': 'Pepsi'
      },
      author: {
        '@type': 'Person',
        'id': '1',
        'name': 'Alfred N. Steele UPDATED'
      },
      review: {
        '@type': 'Review',
        'reviewRating': {
          '@type': 'Rating',
          'ratingValue': '5',
          'bestRating': '5'
        },
        'author': {
          '@type': 'Person',
          'name': 'Joan Crawford'
        }
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        'ratingValue': '5',
        'reviewCount': '100'
      },
      offers: {
        '@type': 'Offer',
        'url': '${url}/adrenalineRush',
        'priceCurrency': 'RUB',
        'price': '120.00',
        'priceValidUntil': '2020-09-30',
        'itemContidion': '${url}/UsedCondition',
        'availability': '${url}/InStock'
      }
    }, params);

    // `user` has been populated
    assert.deepStrictEqual(product.user, user);
  });
});
