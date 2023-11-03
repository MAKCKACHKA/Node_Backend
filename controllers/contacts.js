const contacts = require("../models/contacts");
const HttpError = require("../helpers/error");

const listContacts = async (req, res, next) => {
  const result = await contacts.listContacts(req);
  res.json(result);
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
    return HttpError(res, 404, "Not found");
  }
  res.json(result);
};

const addContact = async (req, res, next) => {
  const { _id: owner } = req.user;
  const body = req.body;
  const result = await contacts.addContact({ ...body, owner });
  res.status(201).json(result);
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contacts.removeContact(contactId);
  if (!result) {
    return HttpError(res, 404, "Not found");
  }
  res.status(200).json({ message: "contact deleted" });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const result = await contacts.updateContact(contactId, body);
  if (!result) {
    return HttpError(res, 404, "Not found");
  }
  res.status(200).json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;
  const result = await contacts.updateStatusContact(contactId, body);
  if (!result) {
    return HttpError(res, 404, "Not found");
  }
  res.status(200).json(result);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
