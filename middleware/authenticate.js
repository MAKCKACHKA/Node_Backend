const jwt = require("jsonwebtoken");

const User = require("../models/userSchema");

const HttpError = require("../helpers/error");

const { SECRET_KEY } = require("../config");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return HttpError(res, 401, "Not valid token (Please use Bearer)");
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      return HttpError(res, 401, "Not authorized");
    }
    req.user = user;
    next();
  } catch {
    return HttpError(res, 401, "Not authorized");
  }
};

module.exports = authenticate;
