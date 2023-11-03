const express = require("express");
const router = express.Router();
const contacts = require("../../controllers/contacts");
const isValidId = require("../../middleware/isValidId");
const {
  validateBody,
  addSchema,
  favoriteSchema,
} = require("../../middleware/isValidBody");

const authenticate = require("../../middleware/authenticate");

router.get("/", authenticate, contacts.listContacts);
router.get("/:contactId", authenticate, isValidId, contacts.getContactById);
router.post("/", authenticate, validateBody(addSchema), contacts.addContact);
router.delete("/:contactId", authenticate, isValidId, contacts.removeContact);
router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(addSchema),
  contacts.updateContact
);
router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(favoriteSchema),
  contacts.updateStatusContact
);

module.exports = router;
