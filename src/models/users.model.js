// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const schema = new mongooseClient.Schema({
    name: { type: String },
    firstName: { type: String }, 
    lastName: { type: String },
    email: { type: String, unique: true, lowercase: true },
    mobilePhone: { type: String },
    homePhone: { type: String },
    githubId: { type: String },
    avatar: { type: String },
    password: { type: String },
    active: { type: Boolean, default: false },
    userType: { type: mongooseClient.Schema.Types.ObjectId, ref: 'userType' },
    country: { type: mongooseClient.Schema.Types.ObjectId, ref: 'country' },
    gender: { type: mongooseClient.Schema.Types.ObjectId, ref: 'gender' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
};
