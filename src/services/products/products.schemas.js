const Joi = require('joi');

const name = Joi.string().trim().min(5).max(100)
  .regex(/^[\sa-zA-Z0-9]$/, 'letters, numbers and spaces').required();
  
const createProduct = Joi.object({
  code: Joi.string().trim().required(),
  name: name,
  description: Joi.string().trim().max(400).allow(''),
  brand: Joi.string().trim().required(),
  author: Joi.object({ 
    id: Joi.string().trim().max(100), 
    name: Joi.string().trim().max(100) 
  }),
  offers: Joi.object({ offers: Joi.string().trim().max(100) })
});

const updateProduct = Joi.object({
  code: Joi.string().trim(),
  name: name,
  description: Joi.string().trim().max(400).allow(''),
  brand: Joi.string().trim(),
  author: Joi.object({ 
    id: Joi.string().trim().max(100), 
    name: Joi.string().trim().max(100) 
  }),
  offers: Joi.object({ offers: Joi.string().trim().max(100) })
});

module.exports = {
  createProduct,
  updateProduct
};