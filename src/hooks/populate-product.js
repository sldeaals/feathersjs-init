// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
/* eslint-disable require-atomic-updates */
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // Get `app`, `method`, `params` and `result` from the hook context
    const { app, method, result, params } = context;
    // Function that adds the user to a single product object
    const fillDependencies = async products => {
      let idArr = products.map(product => product._id);
      const productModel = app.service('products').Model;
      // Populate brand, author, user
      const populatedProducts = await productModel.find().where({ _id: idArr }).populate('user').exec();
      const records = populatedProducts.map(product => { 
        let record = product;
        // Product
        delete record.createdAt;
        delete record.updatedAt;
        delete record.active;
        // User
        if (record.user){
          delete record.user.createdAt;
          delete record.user.updatedAt;
          delete record.user.active;
          delete record.user.password;
        }
        return record;
      });
      return records;
    };

    const addUser = async product => {
      // Get the user based on their id, pass the `params` along so
      // that we get a safe version of the user data
      const _id = product.user;
      
      if (!_id)
        return product;

      const userModel = app.service('users').Model;
      const user = await userModel.findById(_id);
      delete user.createdAt;
      delete user.updatedAt;
      delete user.active;
      delete user.password;
      // Merge the product content to include the `user` object
      return {
        ...product,
        user
      };
    };

    // In a find method we need to process the entire page
    if (method === 'find') {
      // Map all data to include the `user` information
      // context.result.data = await Promise.all(result.data.map(addUser));
      context.result.data = await fillDependencies(result.data);
    } else {
      // Otherwise just update the single result
      context.result = await addUser(result);
    }

    return context;
  };
};
