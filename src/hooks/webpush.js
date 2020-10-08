const webpush = require('web-push');

const triggerPushMsg = function(subscription, dataToSend) {
  //send notification to subscriber
  return webpush.sendNotification(subscription, dataToSend)
  .then(response=>{
    //check everything ok only for test
    console.log ( 'msg sent' , response );
  })
  .catch((err) => {
    //add log features for production
    console.log('Subscription is no longer valid: ', err);
  });
};

module.exports = function () {
    return async context => {
      //get the notification by the notification parameter sent thru our POST
      context.app.service('notifications').get(context.data.notification).then(result=>{
        return result;
      }).then(notification=>{
        //create the message to send based on our notification from DB
        const dataToSend = {
          "notification" : {
            "title" : notification.title,
            "body"  : notification.body,
            "image"  : notification.image ? notification.image : context.app.settings.image ,
            "icon"  : context.app.settings.logo,
            "data" : notification.url ? { "url" : notification.url } : ''
          }
        };
  
        //recall the vapid keys
        const vapidKeys = {
          subject: context.app.settings.vapid.subject,
          publicKey: context.app.settings.vapid.public,
          privateKey: context.app.settings.vapid.private
        };
  
        //set our vapid keys
        webpush.setVapidDetails(
          vapidKeys.subject,
          vapidKeys.publicKey,
          vapidKeys.privateKey
        );
  
        //find all subscribers in our DB
        context.app.service('subscription').find().then(result=>{
          //create a promise
          let promiseChain = Promise.resolve();
          //loop thru our subscribers
          for (let i = 0; i < result.data.length; i++) {
            const subscription = result.data[i];
            promiseChain = promiseChain.then(() => {
              //push our message
              return triggerPushMsg(subscription, JSON.stringify(dataToSend));
            });
          }
          return promiseChain;
        });
      });
      return context;
    };
  };