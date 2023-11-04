const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");

const User = require("../models/userSchema");
const HttpError = require("../helpers/error");

require("dotenv").config();
const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const sendEmail = require("../helpers/sendEmail");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return HttpError(res, 409, "Email in use");
  } else {
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: { email: newUser.email, subscription: "starter" },
    });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return HttpError(
      res,
      404,
      "User not found or Verification has already been passed"
    );
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!email) {
    return HttpError(res, 400, "missing required field email");
  }
  if (!user) {
    return HttpError(res, 401, "User not found");
  }
  if (user.verify) {
    return HttpError(res, 400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return HttpError(res, 401, "User not found");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare || !user.email) {
    return HttpError(res, 401, "Email or password is wrong");
  }
  if (!user.verify) {
    return HttpError(res, 401, "User not verified");
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  if (!req.user) {
    return HttpError(res, 401, "Not authorized");
  }
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const getCurrent = async (req, res) => {
  if (!req.user) {
    return HttpError(res, 401, "Not authorized");
  }
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
};

const setSubscription = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  });

  if (!result) {
    return HttpError(res, 404, "Not found");
  }
  res.status(200).json(result);
};

const updateAvatar = async (req, res) => {
  if (!req.user) {
    return HttpError(res, 401, "Not authorized");
  }
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);

  const image = await jimp.read(resultUpload);
  image.resize(250, 250).writeAsync(resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  logout,
  getCurrent,
  setSubscription,
  updateAvatar,
};
