
export function getDecks () {
    return {
    React: {
      title: 'React',
      dayResult: '9/11/2018',
      questions: [
        {
          question: 'What is React?',
          answer: 'A library for managing user interfaces',
          final: false
        },
        {
          question: 'Where do you make Ajax requests in React?',
          answer: 'The componentDidMount lifecycle event',
          final: false
        }
      ]
    },
    JavaScript: {
      title: 'JavaScript',
      dayResult: '8/15/2018',
      questions: [
        {
          question: 'What is a closure?',
          answer: 'The combination of a function and the lexical environment within which that function was declared.',
          final: false
        }
      ]
    }
  }
}

