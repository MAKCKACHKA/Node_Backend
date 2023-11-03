const express = require("express");

const auth = require("../../controllers/auth");

const authenticate = require("../../middleware/authenticate");
const {
  validateAuth,
  registerSchema,
  loginSchema,
  subscriptionSchema,
} = require("../../middleware/isValidAuth");
const upload = require("../../middleware/upload");

const router = express.Router();

router.post("/register", validateAuth(registerSchema), auth.register);

router.post("/login", validateAuth(loginSchema), auth.login);

router.post("/logout", authenticate, auth.logout);

router.get("/current", authenticate, auth.getCurrent);

router.patch(
  "/subscription",
  authenticate,
  validateAuth(subscriptionSchema),
  auth.setSubscription
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  auth.updateAvatar
);

module.exports = router;
