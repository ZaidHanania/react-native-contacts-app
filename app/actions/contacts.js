import _ from 'lodash'; // For Filtering
import Contacts  from 'react-native-contacts'; // To add contacts to phone

function readContacts(contacts) {
  var contactList = [];
  for (var i in contacts) {
    contactList.push({
      id: contacts[i].recordID,
      firstName: contacts[i].givenName,
      lastName: contacts[i].familyName,
      number: contacts[i].phoneNumbers[0].number,
      checked: false,
      hidden: false
    })
  }

  return _.orderBy(contactList, ['lastName'], ['asc']);
}

export function loadContacts(contacts) {
  return {
    type: 'LOAD_CONTACTS',
    contacts: readContacts(contacts)
  };
}

export function selectContact(id) {
  return {
    type: 'SELECT_CONTACTS',
    contactId: id
  };
}

export function hideSelected() {
  return {
    type: 'HIDE_SELECTED',
  };
}

export function addContact(first, last, number) {
  var newContact = {
    phoneNumbers: [{
      label: "mobile",
      number: number,
    }],
    familyName: last,
    givenName: first,
  }

  Contacts.addContact(newContact, (err) => { /* error */ })

  return {
    type: 'ADD_CONTACT',
    firstName: first,
    lastName: last,
    phoneNumber: number
  };
}

export function toggleShowHidden() {
  return {
    type: 'TOGGLE_SHOW_HIDDEN'
  };
}



