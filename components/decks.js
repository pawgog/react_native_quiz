import React, { Component } from 'react'
import { View, Text, TouchableOpacity, AsyncStorage, ScrollView, StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation'
import { Card } from 'react-native-elements'
import { getDecks } from '../utils/api'

export default class Decks extends Component {

  state = {
    value: null
  }


  componentWillMount () {
    this.setState(() => ({
      value: getDecks()
    }))
  }

  componentDidMount() {
    console.log('componentDidMount');
    AsyncStorage.setItem('FlashCards', JSON.stringify(this.state.value));
  }

  componentWillUpdate(){
    console.log('componentWillUpdate');
    setTimeout(() => {
      if(this.props.navigation.state.params.functionToPass === true) {
        AsyncStorage.getItem('FlashCards').then((value) => {
        const data = JSON.parse(value);
        // console.log(value, data);
        this.setState({value: data});
        this.props.navigation.setParams({functionToPass: false})
      })
      }
    }, 1000);
  }

  checkDate() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    return month + '/' + date + '/' + year
  }

  render() {
    console.log('start decks', this.state);

    console.log('goBack', this.props.navigation);

    let currentDay = this.checkDate();
    

    const { navigate } = this.props.navigation;
    const decks = Object.values(this.state.value)
    console.log('decks', decks);

    const listDecks = decks.map((deck) => 
    
    <Card key={deck.title}>
    {deck.dayResult === currentDay ?
      <TouchableOpacity
        onPress={() => navigate(
          'DeckItem',
          {entryId: deck.title,
          questionLength: deck.questions.length}
        )}>
      <View style={styles.card}>
        <Text style={styles.text}>
          <Text>Name: </Text><Text style={{fontWeight: 'bold'}}>{deck.title}</Text>
        </Text>
        <Text style={styles.text}>
        <Text>Number of cards: </Text><Text style={{fontWeight: 'bold'}}>{deck.questions.length}</Text>
        </Text>
      </View>
      </TouchableOpacity>
    :
      <TouchableOpacity
        onPress={() => navigate(
          'DeckItem',
          {entryId: deck.title,
          questionLength: deck.questions.length}
        )}>
      <View style={styles.cardWarn}>
        <Text style={styles.text}>
          <Text>Name: </Text><Text style={{fontWeight: 'bold'}}>{deck.title}</Text>
        </Text>
        <Text style={styles.text}>
        <Text>Number of cards: </Text><Text style={{fontWeight: 'bold'}}>{deck.questions.length}</Text>
        </Text>
        <Text style={styles.textWarn}>
          You still have not completed the test today!
        </Text>
      </View>
      </TouchableOpacity>
    }
    </Card>
    )

    return (
      <ScrollView>
        <View style={styles.container}>
          {listDecks}
        </View>
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  card: {
    width: 300,
    height: 100,
  },
  cardWarn: {
    width: 300,
    height: 120,
    borderWidth: 3,
    borderColor: 'red'
  },
  text: {
    alignSelf: 'center',
    paddingTop: 15
  },
  textWarn: {
    alignSelf: 'center',
    paddingTop: 15,
    color: 'red'
  }
})
