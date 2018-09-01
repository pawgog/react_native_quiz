import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity, AsyncStorage, Text, TextInput, KeyboardAvoidingView } from 'react-native'

export default class AddQuestionDeck extends Component {

    state = {
        value: null,
        valueItem: null,
        getDeckItems: null,
        question: null,
        answer: null,
        asyncStatus: true
      }

    componentDidMount() {
        this.setState(() => ({
            getDeckItems: this.props.navigation.state.params.entryId
        }))
      }
    
    getData = () => {
        AsyncStorage.getItem('FlashCards').then((value) => {
            const data = JSON.parse(value);
            this.setState({value: data});
            this.setState({asyncStatus: false});
            this.props.navigation.setParams({functionToPass: false})
        })
    }

    setQuestion = (question) => {
        console.log('question', question);
        this.getData()
        this.setState(() => ({
            question: question
        }))
    }
    setAnswer = (answer) => {
        console.log('answer', answer);
        this.getData()
        this.setState(() => ({
            answer: answer
        }))
    }

    addQuestion = () => {
        // console.log('add');
        const { navigation } = this.props;
        let question = {question: this.state.question, answer: this.state.answer, final: false}
        this.state.value[this.state.getDeckItems].questions.push(question)
        console.log('add after', this.state);
        AsyncStorage.setItem('FlashCards', JSON.stringify(this.state.value));
   
        this.props.navigation.navigate(
            'DeckItem',
            { functionToPass: true,
            questionLength: this.state.value[this.state.getDeckItems].questions.length}
        )
    }

    render(){
        const { question, answer } = '';
        console.log('start decks', this.state);

        return (
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <Text>Add new question:</Text>
                <TextInput
                  value={question}
                  style={styles.input}
                  placeholder="Question"
                  onChangeText={(question) => this.setQuestion(question)}
                />
                <TextInput
                  value={answer}
                  style={styles.input}
                  placeholder="Answer"
                  onChangeText={(answer) => this.setAnswer(answer)}
                />
                <TouchableOpacity onPress={this.addQuestion}>
                <Text style={styles.btnAdd}>Add New Question</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView >
        )
    }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 50,
    paddingRight: 50,
  },
  input: {
    width: 300,
    height: 100,
    padding: 10,
  },
  btnAdd: {
    backgroundColor: 'grey',
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    borderRadius: 5
  }
})