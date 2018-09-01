import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Icon } from 'react-native-elements'
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation'
import { getDecks } from '../utils/api'


export default class DeckItem extends Component {

  static navigationOptions = ({ navigation, screenProps }) => ({
    headerLeft: <View style={{marginLeft: 20}}>
                  <Icon name='undo'
                        onPress={ () => { 
                          navigation.navigate('Decks',
                          { functionToPass: true }) }} />
                </View>,
  
  });

  render() {
    const { navigate } = this.props.navigation;
    const getDeckItems = this.props.navigation.state.params.entryId
    const questionLength = this.props.navigation.state.params.questionLength

    console.log('getDeckItems', getDeckItems);

    return (
      <View>
        
        <Text style={styles.text}>{getDeckItems}</Text>
        {questionLength > 0 ? 
        <TouchableOpacity
          onPress={() => navigate(
            'DeckTest',
            {entryId: getDeckItems}
          )}>
            <Text style={styles.btnStart}>Start Test</Text>
        </TouchableOpacity>
        : 
        <TouchableOpacity>
        </TouchableOpacity>
        }
        <TouchableOpacity
          onPress={() => navigate(
            'AddQuestionDeck',
            {entryId: getDeckItems}
          )}>
            <Text style={styles.btnAdd}>Add New Question</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  card: {
    borderWidth: 3,
    borderRadius: 3,
    borderColor: '#000',
    width: 300,
    height: 100,
    padding: 10,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    padding: 20
  },
  btnStart: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b99fc',
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 5
  },
  btnAdd: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'wheat',
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
    borderRadius: 5
  },
})