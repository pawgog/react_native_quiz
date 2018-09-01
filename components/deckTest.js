import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, AsyncStorage, Text, Animated, BackHandler } from 'react-native'
import { Card, Button, Icon } from 'react-native-elements'
import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation'
import Swiper from 'react-native-swiper-animated'
import { clearLocalNotification, setLocalNotification } from '../utils/notification'
import { getDecks } from '../utils/api'


export default class DeckTest extends Component {

    static navigationOptions = ({ navigation, screenProps }) => ({
        headerLeft: <View style={{marginLeft: 20}}>
                    </View>,
      });
    

    state = {
        value: null,
        valueItem: null,
        updateData: true,
        getDeckItems: null,
        answerValue: false,
        scoreTouch: false,
        startButton: false,
        scoreValue: 0,
        questionIndex: 1
      }

    componentWillMount () {
        this.setState(() => ({
            value: getDecks(),
            valueItem: {questions: []}
          }))

        this.animatedValue = new Animated.Value(0);
        this.value = 0;
        this.animatedValue.addListener(({ value }) => {
        this.value = value;
        })
        this.frontInterpolate = this.animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
        })
        this.backInterpolate = this.animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg']
        })
        this.frontOpacity = this.animatedValue.interpolate({
        inputRange: [89, 90],
        outputRange: [1, 0]
        })
        this.backOpacity = this.animatedValue.interpolate({
        inputRange: [89, 90],
        outputRange: [0, 1]
        })
        this.springValue = new Animated.Value(0)
        this.visibility = new Animated.Value(0);
      }

    componentDidMount() {
        console.log('start decks', this.state);

        this.setState(() => ({
            getDeckItems: this.props.navigation.state.params.entryId
        }))

      }

      componentWillUpdate(){
        console.log('componentWillUpdate', this.state.updateData);

        if(this.state.updateData === true) {
            AsyncStorage.getItem('FlashCards').then((value) => {
                const data = JSON.parse(value);
                // console.log(value, data);
                this.setState({value: data});
                this.setState(() => ({
                    valueItem: this.state.value[this.state.getDeckItems]
                  }))
                this.state.valueItem.questions.push({question: 'final', answer: 'final', final: true})
                this.setState({updateData: false});
            })
        }
      }
      
      startTest() {
        clearLocalNotification().then(setLocalNotification)

        this.setState(() => ({
            startButton: true
          }))
      }      

      flipCard() {
        if (this.value >= 90) {
          Animated.spring(this.animatedValue,{
            toValue: 0,
            friction: 8,
            tension: 10
          }).start();
          this.setState(() => ({
            answerValue: false
          }))
        } else {
          Animated.spring(this.animatedValue,{
            toValue: 180,
            friction: 8,
            tension: 10
          }).start();
          this.setState(() => ({
            answerValue: true
          }))
        }
    
      }

      spring () {
        this.springValue.setValue(0)
        Animated.spring(
          this.springValue,
          {
            toValue: 1,
            friction: 1
          }
        ).start()
      }


      showElement () {
        this.visibility.setValue(1)
        Animated.spring(
          this.visibility,
          {
            toValue: 1,
            friction: 1
          }
        ).start()
      }

      changeDayStatus () {
        let date = new Date().getDate();
        let month = new Date().getMonth() + 1;
        let year = new Date().getFullYear();
        this.state.value[this.state.getDeckItems].dayResult = month + '/' + date + '/' + year
        // console.log('after changeDayStatus', this.state);
      }


      correctAnswer(score) {
        const questionsSum = this.state.valueItem.questions.length - 1
        if(score < questionsSum){
            let calcScore = score + 1
            this.setState(() => ({
                scoreValue: calcScore,
                scoreTouch: true
            }))
        }
        this.showElement()
      }

      inCorrectAnswer(score) {
        this.showElement()
      }

      goToDeckItem() {
        this.state.valueItem.questions.splice(-1,1)
        AsyncStorage.setItem('FlashCards', JSON.stringify(this.state.value));
        this.props.navigation.navigate(
            'DeckItem',
          )
      }

      swiper = null;

      prev = () => {
        let temporaryIndex = this.state.questionIndex
        this.setState(() => ({
            questionIndex: temporaryIndex - 1,
        }))
        this.swiper.forceLeftSwipe();
        this.visibility.setValue(0)
      }
    
      next = () => {
        let temporaryIndex = this.state.questionIndex
        this.setState(() => ({
            questionIndex: temporaryIndex + 1,
        }))
        this.swiper.forceRightSwipe();
        this.visibility.setValue(0)

        if (this.state.answerValue === true) {
            Animated.spring(this.animatedValue,{
              toValue: 0,
              friction: 8,
              tension: 10
            }).start();
        } 
        // console.log('questionIndex', this.state.questionIndex, this.swiper);
        const questionsSum = this.state.valueItem.questions.length - 1
        if(this.state.questionIndex === questionsSum) {
            this.spring();
            this.changeDayStatus();
        }
      }

      start = () => {
        this.setState(() => ({
            questionIndex: 1,
            scoreValue: 0
        }))
        this.swiper.jumpToIndex(0);
        this.swiper.forceLeftSwipe();
      }


    render(){
        console.log('start decks', this.state);
        const frontAnimatedStyle = {
            transform: [
              { rotateY: this.frontInterpolate }
            ]
          }
          const backAnimatedStyle = {
            transform: [
              { rotateY: this.backInterpolate }
            ]
        }

        const questionIndex = this.state.questionIndex

        const startButton = this.state.startButton
        const deckItemQuestion = this.state.valueItem.questions
        const currentScore = this.state.scoreValue
        const scoreTouch = this.state.scoreTouch
        const questionsSum = this.state.valueItem.questions.length - 1
        const scorePercent = Math.round((currentScore/questionsSum)*100)
        console.log('decks', deckItemQuestion);

        const list = deckItemQuestion.map((question) => 
        <View key={question.question} style={{ flex: 1 }}>
        {question.final === true ?  
        <View>
            <View>
                <Animated.View transition='scaleX' duration={250} easing='ease-in-out' style={{transform: [{scale: this.springValue}]}}>
                    <Card containerStyle={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.text}>{currentScore} / {questionsSum}</Text>
                        <Text style={styles.scoreText}>{scorePercent}%</Text>
                    </Card>
                </Animated.View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity>
                <Button  
                onPress={() => this.goToDeckItem()} 
                buttonStyle={{
                    backgroundColor: "grey",
                    width: 200,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 10,
                    margin: 10
                }}
                title="Back to individual Deck">
                </Button>
            </TouchableOpacity>
            <TouchableOpacity>
                <Button 
                onPress={this.start}
                buttonStyle={{
                    backgroundColor: "green",
                    width: 200,
                    height: 45,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 10,
                    margin: 10
                }}
                title="Start test again">
                </Button>
            </TouchableOpacity>
            </View>
            </View>
            :
            <View key={question.question}>
                <View style={styles.container}>
                    <View style={styles.card}>
                        <Card containerStyle={{height: 150, flexDirection:'row', flexWrap: 'wrap'}}>
                            <Animated.View style={[styles.flipCard, frontAnimatedStyle, {opacity: this.frontOpacity}]}>
                                <Text>Question:</Text><Text style={{fontWeight: 'bold', flexWrap: 'wrap'}}> {question.question}</Text>
                            </Animated.View>
                            <Animated.View style={[styles.flipCard, styles.flipCardBack, backAnimatedStyle, {opacity: this.backOpacity}]}>
                                <Text>Answer: </Text><Text style={{fontWeight: 'bold', flexWrap: 'wrap'}}>{question.answer}</Text>
                            </Animated.View>
                        </Card>
                        <View style={{alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => this.flipCard()}>
                                <Animated.View style={[styles.flipCard, frontAnimatedStyle, {opacity: this.frontOpacity}]}>
                                    <Text style={styles.btnQue}>Check Answer</Text>
                                </Animated.View>
                                <Animated.View style={[styles.flipCard, styles.flipCardButtonBack, backAnimatedStyle, {opacity: this.backOpacity}]}>
                                    <Text style={styles.btnAns}>Back to Question</Text>
                                </Animated.View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                        <View>
                        <View style={styles.buttonContainer}>
                      
                                <Button  
                                onPress={() => this.correctAnswer(currentScore)} 
                                buttonStyle={{
                                    backgroundColor: "green",
                                    width: 200,
                                    height: 45,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                title="Correct">
                                </Button>

                                <Button 
                                onPress={() => this.inCorrectAnswer(currentScore)}
                                buttonStyle={{
                                    backgroundColor: "red",
                                    width: 200,
                                    height: 45,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                title="Incorrect">
                                </Button>
                   
                        </View>
                            <View style={styles.scoreContainer}>
                                <Text style={styles.scoreText}>
                                    {questionIndex} / {questionsSum}
                                </Text>
                            </View>
                        </View>
                        <Animated.View style={{opacity: this.visibility}}>
                        <View style={styles.buttonChange}>
                            <TouchableOpacity>
                                <Button  
                                onPress={this.prev} 
                                buttonStyle={{
                                    backgroundColor: "grey",
                                    width: 80,
                                    height: 45,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                title="Previous">
                                </Button>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Button 
                                onPress={this.next}
                                buttonStyle={{
                                    backgroundColor: "grey",
                                    width: 80,
                                    height: 45,
                                    borderColor: "transparent",
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                title="Next">
                                </Button>
                            </TouchableOpacity>
                        </View>
                        </Animated.View>
                </View>
            </View>
            }
            </View>
            
        )
        if(startButton === true) {
        return (
            <Swiper showPagination={false} swiper={false}
                ref={(swiper) => {
                    this.swiper = swiper;
              }}>
                {list}
            </Swiper>
        )
        }else {
            return (
                <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button  
                    onPress={() => this.startTest()} 
                    buttonStyle={{
                        backgroundColor: "green",
                        width: 150,
                        height: 45,
                        borderColor: "transparent",
                        borderWidth: 0,
                        borderRadius: 10,
                    }}
                    title="ARE YOU READY? CLICK TO START">
                    </Button>
                </View>
            )
        }
    }
}
const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#009688',
    },
    scoreContainer: {
        width: 300,
        alignItems: 'center',
        paddingLeft: 50,
    },
    scoreText: {
        fontWeight: 'bold',
        color: 'black',
        
    },
    container: {
        alignItems: 'center',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 80,
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 50,
        paddingRight: 50,
    },
    buttonChange: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width: 300,
        height: 300,
        padding: 10,
        backfaceVisibility: 'hidden',
    },
    text: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scoreText: {
        paddingTop: 30,
        fontSize: 30,
        fontWeight: 'bold'
    },
    flipCard: {
        width: 150
    },
    flipCardBack: {
        position: 'absolute',
    },
    flipCardButtonBack: {
        marginTop: -40
    },
    btnQue: {
        backgroundColor: '#f7d4a1',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        borderRadius: 5
    },
    btnAns: {
        backgroundColor: '#69440e',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        borderRadius: 5
    },
    btnAdd: {
        backgroundColor: 'green',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        borderRadius: 5
    },
    btnDec: {
        backgroundColor: 'red',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        borderRadius: 5
    }
})