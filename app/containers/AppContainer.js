import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadContacts, selectContact, hideSelected, addContact, toggleShowHidden } from '../actions';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  TextInput
} from 'react-native';
import Contacts  from 'react-native-contacts'; // To get contacts from phone
import Spinner from 'react-native-spinkit'; // Inital Loader
import _ from 'lodash'; // For Filtering


class AppContainer extends Component {
  constructor(props) {
    super(props);

    // Load contacts
    Contacts.getAll((err, contacts) => {
      if(err === 'denied'){
        // error
      } else {
        this.props.loadContacts(contacts);
      }
    })

    // initiate listview
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      ds: ds,
      // For adding a contact
      firstName: '',
      lastName: '',
      phoneNumber: ''
    };    
  }

  componentWillReceiveProps(nextProps) {
    // To re-render listview on change of contact list
    if(nextProps.contacts !== this.props.contacts) {
      var filteredContacts = this.props.showHidden ? nextProps.contacts : _.filter(nextProps.contacts, function(o) { return !o.hidden; });
      this.setState({
        contactsDs: this.state.ds.cloneWithRows(filteredContacts)
      });    
    } else if (nextProps.showHidden !== this.props.showHidden) { // Check if the show hidden checkbox has changed
      var filteredContacts = nextProps.showHidden ? this.props.contacts : _.filter(this.props.contacts, function(o) { return !o.hidden; });
      this.setState({
        contactsDs: this.state.ds.cloneWithRows(filteredContacts)
      });  
    }
  }

  // Function that handles selecting a contact
  _pressRow(id) {
    this.props.selectContact(id);
    }

  // Function that handles the hide selected button
  _hideSelected() {
    this.props.hideSelected();
  }

  // Function that handles adding a contact
  _addContact() {
    if (this.state.firstName && this.state.lastName && this.state.phoneNumber) {
      this.props.addContact(this.state.firstName, this.state.lastName, this.state.phoneNumber);
      this.setState({firstName: '', lastName: '', phoneNumber: ''});
      this._textInput1.setNativeProps({text: ''});
      this._textInput2.setNativeProps({text: ''});
      this._textInput3.setNativeProps({text: ''});
    }
  }

  // Function that handles showing of hidden contacts
  _toggleShowHidden() {
    this.props.toggleShowHidden();
  }

  render() {
    if (!this.props.pending) {  // If contacts have loaded
      return (
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>CONTACTS</Text>
          </View>
          <View style={styles.addContact}>
            <View style={styles.addName}>
              <TextInput
                ref={component => this._textInput2 = component}
                style={styles.textInputName}
                placeholder="First Name"
                onChangeText={(firstName) => this.setState({firstName})}
                />
              <TextInput
                ref={component => this._textInput1 = component}
                style={styles.textInputName}
                placeholder="Last Name"
                onChangeText={(lastName) => this.setState({lastName})}
              />
            </View>
            <View style={styles.addName}>
              <TextInput
                ref={component => this._textInput3 = component}
                style={styles.textInputNumber}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                onChangeText={(phoneNumber) => this.setState({phoneNumber})}
              />
            </View>
            <TouchableHighlight style={styles.addContactButton} onPress={() => {
              this._addContact();
            }}>
              <Text style={styles.addContactText}>Add Contact</Text>
            </TouchableHighlight>
          </View>

          <View style={styles.showHiddenContacts}>
            <Text>Show Hidden Contacts </Text>
            <TouchableHighlight onPress={() => {
              this._toggleShowHidden();
            }} style={styles.showHiddenContactsCheck}><Text style={styles.showHiddenContactsText}>{this.props.showHidden ? '✓' : ' '}</Text></TouchableHighlight>
          </View>
          
          <ListView
          enableEmptySections={true}
          style={styles.listview}
          dataSource={this.state.contactsDs}
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderRow={(data) => 
            <TouchableHighlight onPress={() => {
              this._pressRow(data.id);
            }}>
              <View style={data.checked ? styles.rowSelected : styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.name}>{data.firstName + ' ' + data.lastName}</Text>
                  <Text style={styles.number}>{data.number}</Text>
                </View>
                <View style={styles.checkbox}>
                  <View style={styles.box}><Text style={styles.tick}>{data.checked ? '✓' : ' '}</Text></View>
                </View>
              </View>
            </TouchableHighlight>}
        />
        <TouchableHighlight style={styles.buttonHide} onPress={() => {
              this._hideSelected();
            }}>
            <Text style={styles.hideText}>Hide Selected</Text>
        </TouchableHighlight>
      </View>
      )
    } else {  // Loading contacts, show spinner
      return (
        <View style={styles.spinnerContainer}>
          <Spinner style={styles.spinner} isVisible={true} size={100} type={'Circle'} color={'#f45b69'}/>

        </View>
      )
    }
  }
}

function mapStateToProps(store) {
  return {
    contacts: store.contacts.contacts,
    pending: store.contacts.pending,
    showHidden: store.contacts.showHidden
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadContacts: contacts => dispatch(loadContacts(contacts)),
    selectContact: id => dispatch(selectContact(id)),
    hideSelected: () => dispatch(hideSelected()),
    addContact: (first, last, phone) => dispatch(addContact(first, last, phone)),
    toggleShowHidden: () => dispatch(toggleShowHidden())
  };
}

//  Styling
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  listview: {
    flex: 1,
    flexDirection: 'column'
  },
  row: {
    padding: 10,
    flexDirection: 'row'
  },
  rowSelected: {
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#eeeeee'
  },
  name: {
    fontSize: 18
  },
  number: {
    paddingTop: 5,
    color: '#666',
    fontSize: 16
  },
  rowLeft: {
    flex: 1
  },
  checkbox: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  box: {
    width: 22,
    height: 22,
    borderWidth: 0.5, 
    borderColor: 'black',
  },
  tick: {
    textAlign: 'center',
    fontSize: 18
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#DFE0E1'
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10
  },
  title: {
    color: '#f45b69',
    fontSize: 24,
    textAlign: 'center',
  },
  buttonHide: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:40,
    right: 40,
    bottom: 20,
    padding: 20,
    backgroundColor: '#f45b69'
  },
  hideText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  addName: {
    flexDirection: 'row',
  },
  textInputName: {
    flex: 1,
    height: 35, 
    borderColor: 'gray', 
    borderWidth: 1,
    margin: 10,
    padding: 10
  },
  textInputNumber: {
    flex: 1,
    height: 35, 
    borderColor: 'gray', 
    borderWidth: 1,
    margin: 10,
    padding: 10
  },
  addContact: {
    flexDirection: 'column',
    backgroundColor: '#eee',
    padding: 10,
  },
  addContactText: {
    paddingLeft: 10,
    fontSize: 18,
    textAlign: 'center',
    color: 'white'
  },
  addContactButton: {
    backgroundColor: '#f45b69',
    padding: 10,
    margin: 10,
  },
  showHiddenContacts: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'flex-end',
    backgroundColor: '#ddd',
  },
  showHiddenContactsCheck: {
    width: 18,
    height: 18,
    borderWidth: 0.5, 
    borderColor: 'black',
    marginLeft: 10
  },
  showHiddenContactsText: {
    textAlign: 'center',
    fontSize: 14,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
