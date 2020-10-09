// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    let newData = {}, author = {};
    const { data, id, params, method } = context;

    // The logged in user
    const user = data.user || params.user || params.query.user;
    
    // Validate method to create the notification
    // And if its required to 
    switch (method){
    case 'create': {
      if (Object.entries(author)[0])
        newData = {
          title: 'New product author',
          body: `${data.author.name} was named author of the product ${data.name}`,
        };
      else {
        context.data = {};
        return context;
      }
        
      break;
    }
    case 'put':
    case 'patch':
    case 'update': {
      const productService = context.app.services['products'];
      const oldRecord = await productService._get(id);
      const oldAuthor = oldRecord.author;
      author = Object.entries(data.author)[0] 
        ? (data.author.id && data.author.name ? { '@type': 'Person', id: data.author.id, name: data.author.name.substring(0, 100) } : oldAuthor)
        : oldAuthor;
      newData = { author: Object.entries(author)[0] && oldAuthor.id !== author.id ? `${data.author.name} was named author of the product ${data.name}` : '' };
      
      if (Object.entries(author)[0] && oldAuthor.id !== author.id)
        newData = {
          title: 'Change of product author',
          body: `${data.author.name} was named author of the product ${data.name}`,
        };
      else {
        context.data = {};
        return context;
      }
      break;
    }
    }

    if (newData){
      newData.image = `http://localhost:8080/notifications/images/author/${data.author.id}`;
      newData.icon = `http://localhost:8080/notifications/icons/author/${data.author.id}`;
      newData.url = `http://localhost:8080/notifications/log/author/${data.author.id}`;
    }

    newData = {
      ...newData,
      user: user._id || user
    };

    // Create new notification for products authors
    const notificationService = context.app.services['notifications'];
    const newNotification = await notificationService.create(newData);

    context.data = newNotification;

    return context;
  };
};
  