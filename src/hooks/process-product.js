// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    let newData = {};
    const { data, id, params, method } = context;

    // Throw an error if we didn't get required fields
    // && Make sure that fields has correct limitation
    if(!data.code && method === 'create') {
      console.log('A product must have a code');
      throw new Error('A product must have a code');
    } else if(data.code)
      newData.code = data.code.substring(0, 20);

    if(!data.name && method === 'create') {
      console.log('A product must have a name');
      throw new Error('A product must have a name');
    } else if(data.name)
      newData.name = data.name.substring(0, 100);

    if(!data.description && method === 'create') {
      console.log('A product must have a description');
      throw new Error('A product must have a description');
    } else if (data.description)
      newData.description = data.description.substring(0, 400);

    if(!data.brand && method === 'create') {
      console.log('A product must have a brand');
      throw new Error('A product must have a brand');
    } else if (data.brand)
      newData.brand = { '@type': 'Brand', name: data.brand.substring(0, 100) };

    if(data.offers || Object.entries(data.offers)[0])
      newData.offers = Object.entries(data.offers)[0] 
        ? { 
          '@type': 'Offer', url: data.offers.url, priceCurrency: data.offers.priceCurrency,
          price: data.offers.price, priceValidUntil: data.offers.priceValidUntil, 
          itemContidion: data.offers.itemContidion, availability: data.offers.availability 
        }
        : {};

    // The logged in user
    const user = data.user || params.user || params.query.user
    
    // Validate method result fields value
    switch (method){
      case 'create':
        newData.author = Object.entries(data.author)[0] 
          ? (data.author.id && data.author.name ? { '@type': 'Person', id: data.author.id, name: data.author.name.substring(0, 100) } : {})
          : {};
        newData.notification = { author: Object.entries(newData.author)[0] ? `${data.author.name} was named author of the product ${newData.name}` : '' };
        newData.createdAt = new Date().getTime();
        break;
      case 'put':
      case 'patch':
      case 'update':
        const productService = context.app.services['products'];
        const oldRecord = await productService._get(id);
        const oldAuthor = oldRecord.author;
        newData.author = Object.entries(data.author)[0] 
          ? (data.author.id && data.author.name ? { '@type': 'Person', id: data.author.id, name: data.author.name.substring(0, 100) } : oldAuthor)
          : oldAuthor;
        newData.notification = { author: Object.entries(newData.author)[0] && oldAuthor !== newData.author ? `${data.author.name} was named author of the product ${newData.name}` : '' };
        newData.updatedAt = new Date().getTime();
        break;
    }

    // Update the original data (so that people can't submit additional stuff)
    newData = {
      ...newData,
      user: user._id || user
    };
    context.data = newData;

    return context;
  };
};
