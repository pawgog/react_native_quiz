import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, AsyncStorage, Button, KeyboardAvoidingView  } from 'react-native'
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation'


export default class AddNewDeck extends Component {

  state = {
    value: null,
    inputValue: null
  }

  saveData = (input) => {
    console.log('new input', input);

    this.setState({
      inputValue: input
    });

    let key = input;
    let obj = {};
    let newItem = {[key]:{
                      title: input,
                      dayResult: null,
                      questions: [
                      ]}
                  };

    AsyncStorage.getItem('FlashCards').then((value) => {
      const data = JSON.parse(value);
      // console.log(value, data);
      let newObjectAssign = Object.assign({}, data, newItem);

      this.setState({
        value: newObjectAssign
      });
    })
  }

  updateData() {
    let inputValue = this.state.inputValue
    console.log('inputValue', inputValue);
    
    AsyncStorage.setItem('FlashCards', JSON.stringify(this.state.value));
    console.log('update', this.state);
    console.log(this.textInput);
    
    this.textInput.clear()
    this.props.navigation.navigate(
      'DeckItem',
      {entryId: inputValue,
      questionLength: 0}
    )
    // console.log('update after', this.state);
  }

  render() {
    const { input } = '';
    const { navigate } = this.props.navigation;

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <Text>Add new deck:</Text>
            <TextInput
              value={input}
              style={styles.input}
              placeholder="Deck name"
              onChangeText={(text) => this.saveData(text)}
              ref={input => { this.textInput = input }}
            />
        <TouchableOpacity
          onPress={this.updateData.bind(this)}>
            <Text style={styles.btnSave}>Save</Text>
        </TouchableOpacity>
        </KeyboardAvoidingView >
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -70
  },
  input: {
    width: 300,
    height: 100,
    padding: 10,
  },
  text: {
    alignSelf: 'center',
    alignItems: 'center'
  },
  btnSave: {
    backgroundColor: 'grey',
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 5
  },
})