// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'products';
  const mongooseClient = app.get('mongooseClient');
  const schema = new mongooseClient.Schema({
    code: { type: String },
    name: { type: String }, 
    description: { type: String },
    brand: { "@type": { type: String }, id: { type: String }, name: { type: String } },
    author: { "@type": { type: String }, id: { type: String }, name: { type: String } },
    offers: { 
      "@type": { type: String },
      url: { type: String } , priceCurrency: { type: String },
      price: { type: String }, priceValidUntil: { type: String }, 
      itemContidion: { type: String }, availability: { type: String }
    },
    user: { type: mongooseClient.Schema.Types.ObjectId, ref: 'users' },
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
