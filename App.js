import React from 'react'
import { View } from 'react-native'
import Decks from './components/decks'
import DeckItem from './components/deckItem'
import AddNewDeck from './components/addNew'
import AddQuestionDeck from './components/addQuestion'
import DeckTest from './components/deckTest'
import { setLocalNotification } from './utils/notification'
import { submitEntry, getEntry } from './utils/api'
import { TabNavigator, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation'
import { FontAwesome, Ionicons } from '@expo/vector-icons'

const Tabs = createMaterialTopTabNavigator({
  Decks: {
    screen: Decks,
    navigationOptions: {
      tabBarLabel: 'Decks',
      tabBarIcon: ({ tintColor }) => <Ionicons name='ios-bookmarks' size={30} color={tintColor} />
    },
  },
  AddNewDeck: {
    screen: AddNewDeck,
    navigationOptions: {
      tabBarLabel: 'Add New Deck',
      tabBarIcon: ({ tintColor }) => <FontAwesome name='plus-square' size={30} color={tintColor} />
    },
  },
})

const MainNavigator = createStackNavigator({
  Home: {
    screen: Tabs,
  },
  DeckItem: {
    screen: DeckItem
  },
  AddQuestionDeck: {
    screen: AddQuestionDeck
  },
  DeckTest: {
    screen: DeckTest
  }
})

export default class App extends React.Component {
  componentDidMount(){
    setLocalNotification()
  }
  
  render() {
    return (
      <View style={{flex: 1}}>
        <MainNavigator/>
      </View>
    )
  }
}
