import _ from 'lodash'; // For Filtering

const initialState = {
  contacts: [],
  pending: true,
  showHidden: false
};

function selectContact(state, id) {
  for (var i in state.contacts) {
    if (state.contacts[i].id === id) {
      state.contacts[i].checked = !state.contacts[i].checked;
    }
  }
  return {
    ...state,
    contacts: [...state.contacts]
  };
}

function hideSelected(state) {
  for (var i in state.contacts) {
    if (state.contacts[i].checked === true) {
      state.contacts[i].hidden = true;
      state.contacts[i].checked = false;
    }
  }
  return {
    ...state,
    contacts: [...state.contacts]
  };
}

function addContact(state, first, last, number) {
  state.contacts.push({
    id: "new_" + Math.random(), // generate arbitrary id
    firstName: first,
    lastName: last,
    number: number,
    checked: false,
    hidden: false
  })

  return {
    ...state,
    contacts: _.orderBy(state.contacts, ['lastName'], ['asc'])
  };
}

function contacts(state = initialState, action) {
  if (action.type === 'LOAD_CONTACTS') {
    return {
      ...state,
      contacts: action.contacts,
      pending: false
    };
  }

  if (action.type === 'SELECT_CONTACTS') {
    return selectContact(state, action.contactId);
  }

  if (action.type === 'HIDE_SELECTED') {
    return hideSelected(state);
  }

  if (action.type === 'ADD_CONTACT') {
    return addContact(state, action.firstName, action.lastName, action.phoneNumber);
  }

  if (action.type === 'TOGGLE_SHOW_HIDDEN') {
    return {
      ...state,
      showHidden: !state.showHidden
    }
  }

  return state;
};


export default contacts;
