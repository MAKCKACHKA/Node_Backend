const HttpError = require("../helpers/error");
const Joi = require("joi");

const validateAuth = (schema) => {
  const func = (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(HttpError(res, 400, error.message));
    }
    next();
  };

  return func;
};

const registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.valid("starter", "pro", "business").required(),
});

module.exports = {
  validateAuth,
  registerSchema,
  loginSchema,
  subscriptionSchema,
};
