const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db/contacts.json");
console.log("contactsPath :>> ", contactsPath);

/**
 * Get the contacts from the file
 * @returns {array}
 */
async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);
  } catch (error) {
    console.log(`Something went wrong:  ${error.message}`);
  }
}

/**
 * Get contact by ID
 * @param {string} contactId 
 * @returns {object || null} 
 */
async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const result = contacts.find((contact) => contact.id === contactId);
    return result || null;
  } catch (error) {
    console.log(`Something went wrong:  ${error.message}`);
  }
}

/**
 * Delete contact by ID
 * @param {string} contactId 
 * @returns {object || null} the removed contact
 */
async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

/**
 * Add new contact 
 * @param {object} data 
 * @returns {object} new contact
 */
async function addContact(data) {
  try {
     const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
  } catch (error) {
    console.log(`Something went wrong:  ${error.message}`);
  }
 
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};
