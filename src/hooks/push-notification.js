// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
    return async context => {
      const { data, result } = context;
      const notification = { notification: data._id || result._id };
      // Pushes new notifications
      const pushService = context.app.services['push'];
      const newPush = await pushService.create(notification);
      // Populate notification pushed
      const pushModel = pushService.Model;
      const populatedPush = await pushModel.find().where({ _id: newPush._id }).populate('notification').exec();
      context.data = populatedPush;
  
      return context;
    };
  };
  