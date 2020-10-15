// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
/* eslint-disable require-atomic-updates */
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const userFields = 'name firstName lastName email mobilePhone homePhone';
    // Get `app`, `method`, `params` and `result` from the hook context
    const { app, method, result } = context;
    // Function that adds the user to a single product object
    const fillDependencies = async products => {
      let idArr = products.map(product => product._id);
      const productModel = app.service('products').Model;
      // Populate user { brand, author }(this will be populated in another commit) 
      return await productModel.find().where({ _id: idArr })
        .populate({ path: 'user', select: userFields })
        .exec();
    };

    const addUser = async product => {
      // Get the user based on their id, pass the `params` along so
      // that we get a safe version of the user data
      const _id = product.user;
      
      if (!_id)
        return product;

      const userModel = app.service('users').Model;
      const user = await userModel.findById(_id)
        .select(userFields);
      // Merge the product content to include the `user` object
      return {
        ...product,
        user
      };
    };

    // In a find method we need to process the entire page
    if (method === 'find') {
      // Map all data to include the `user` information
      context.result.data = await fillDependencies(result.data);
    } else {
      // Otherwise just update the single result
      context.result = await addUser(result);
    }

    return context;
  };
};
