const HttpError = require("../helpers/error");
const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const validateBody = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(res, 400, error.message));
    }
    next();
  };

  return func;
};
module.exports = { validateBody, addSchema, favoriteSchema };
