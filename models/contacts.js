const Contacts = require("./contactSchema.js");

const listContacts = async (req) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  const query = { owner };
  if (favorite !== undefined) {
    query.favorite = true;
  }
  const result = await Contacts.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  return result;
};

const getContactById = async (contactId) => {
  const result = await Contacts.findById(contactId);
  return result;
};

const addContact = async (body) => {
  const result = await Contacts.create(body);
  return result;
};

const removeContact = async (contactId) => {
  const result = await Contacts.findByIdAndRemove(contactId);
  return result;
};

const updateContact = async (contactId, body) => {
  const result = await Contacts.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return result;
};

const updateStatusContact = async (contactId, body) => {
  const result = await Contacts.findByIdAndUpdate(contactId, body, {
    new: true,
  });
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
