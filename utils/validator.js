const { celebrate, Joi } = require('celebrate');
const { URL_REGEXP } = require('./constants');

module.exports = {
  validateSignUp: celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(URL_REGEXP),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),

  validateSignIn: celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),

  validateGetUser: celebrate({
    params: Joi.object().keys({
      userId: Joi.string().hex().length(24).required(),
    }),
  }),

  validateCardId: celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),

  validateUpdateProfile: celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),

  validateUpdateProfileAvatar: celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(URL_REGEXP).required(),
    }),
  }),

  validateCreateCard: celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().pattern(URL_REGEXP).required(),
    }),
  }),
};
