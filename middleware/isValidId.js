const { isValidObjectId } = require("mongoose");

const HttpError = require("../helpers/error");

const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(HttpError(res, 400, `${contactId} is not valid id`));
  }
  next();
};

module.exports = isValidId;
