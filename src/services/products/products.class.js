// This is the database adapter service class
const { Service } = require('feathers-mongoose');

exports.Products = class Products extends Service {
  create (data, params) {
    return super.create(data, params);
  }  
};
