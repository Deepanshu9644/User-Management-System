const express = require('express');
const { validateRequest, Joi } = require('../middlewares/validateRequest');
const usersController = require('../controllers/users.controller');

const router = express.Router();

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const geoSchemaRequired = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required()
}).required();

const addressSchemaRequired = Joi.object({
  street: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  zipcode: Joi.string().trim().required(),
  geo: geoSchemaRequired
}).required();

const createUserSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().required(),
  company: Joi.string().trim().required(),
  address: addressSchemaRequired
});

const putUserSchema = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().required(),
  company: Joi.string().trim().required(),
  address: addressSchemaRequired
});

const geoSchemaPatch = Joi.object({
  lat: Joi.number(),
  lng: Joi.number()
}).and('lat', 'lng');

const addressSchemaPatch = Joi.object({
  street: Joi.string().trim(),
  city: Joi.string().trim(),
  zipcode: Joi.string().trim(),
  geo: geoSchemaPatch
}).min(1);

const patchUserSchema = Joi.object({
  name: Joi.string().trim(),
  email: Joi.string().trim().email(),
  phone: Joi.string().trim(),
  company: Joi.string().trim(),
  address: addressSchemaPatch
}).min(1);

const listQuerySchema = Joi.object({
  search: Joi.string().trim().allow(''),
  sort: Joi.string().trim().allow(''), // e.g. name or -createdAt
  page: Joi.number().integer().positive(),
  limit: Joi.number().integer().positive().max(100)
});

router.get('/', validateRequest({ query: listQuerySchema }), usersController.getUsers);

router.get('/:id', validateRequest({ params: idParamSchema }), usersController.getUserById);

router.post('/', validateRequest({ body: createUserSchema }), usersController.createUser);

router.put('/:id', validateRequest({ params: idParamSchema, body: putUserSchema }), usersController.updateUserPut);

router.patch('/:id', validateRequest({ params: idParamSchema, body: patchUserSchema }), usersController.updateUserPatch);

router.delete('/:id', validateRequest({ params: idParamSchema }), usersController.deleteUser);

module.exports = router;
