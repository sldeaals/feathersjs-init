// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    let notification = {};
    const { data } = context;

    // Throw an error if we didn't get required fields
    if(!data.code) {
      console.log('A product must have a code');
      throw new Error('A product must have a code');
    }
    if(!data.name) {
      console.log('A product must have a name');
      throw new Error('A product must have a name');
    }
    if(!data.description) {
      console.log('A product must have a description');
      throw new Error('A product must have a description');
    }
    if(!data.brand) {
      console.log('A product must have a brand');
      throw new Error('A product must have a brand');
    }

    // The logged in user
    const { user } = context.params;
    // The actual product
    // Make sure that fields has correct limitation
    const code = data.code.substring(0, 20);
    const name = data.name.substring(0, 100);
    const description = data.description.substring(0, 400);
    const brand = { '@type': 'Brand', name: data.brand.substring(0, 100) };
    const author = Object.entries(data.author)[0] 
      ? (data.author.id && data.author.name ? { '@type': 'Person', id: data.author.id, name: data.author.name.substring(0, 100) } : {})
      : {};
    const offers = !Object.entries(data.offers)[0] 
      ? { 
        '@type': 'Offer', url: data.offers, priceCurrency: data.priceCurrency,
        price: data.price, priceValidUntil: data.priceValidUntil, 
        itemContidion: data.itemContidion, availability: data.availability 
      }
      : {};

    notification.author = Object.entries(author)[0] ? `${data.author.name} was named author of the product ${name}` : '';

    // Update the original data (so that people can't submit additional stuff)
    context.data = {
      code, name, description, brand, author, offers,
      // Set the user id
      userId: user._id,
      // Add the current date
      createdAt: new Date().getTime(),
      notification
    };

    return context;
  };
};
