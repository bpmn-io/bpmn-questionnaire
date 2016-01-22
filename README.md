[![Stories in Ready](https://badge.waffle.io/PHILIPPFROMME/bpmn-questionnaire.png?label=ready&title=Ready)](https://waffle.io/PHILIPPFROMME/bpmn-questionnaire)
# bpmn-questionnaire

<img style="height: 15px" src="/resources/img/logo.png">

__Note: This library is in very early development stage and therefore not usable.__

A library for questionnaires on BPMN 2.0.

## About

Create and embed questionnaires on BPMN 2.0 in your own website. 
Implement your own types of questions with ease.

## Example Use

Create a questionnaire:

```
var q = new BpmnQuestionnaire({

  // Your container (can be a string of an id or an element)
  container: 'container',

  // Your questionnaire
  questionnaire: questionnaire,
  
  // Your types
  types: {
    single: single
  }
});
```

Create a type:

```
var single = BpmnQuestionnaire.createType({
  renderQuestion: function () {
    var that = this;
    var buttons = [];
    this.options.answers.forEach(function(answer) {
      buttons.push(h('button', {
        onClick: function() {
          that.update({
            selected : [answer]
          });
        }
      }, answer));
    });
    
    var html = 
      h('div', [
        h('p', this.options.text),
        h('div', buttons)
      ]);
  
    // Return a virtual DOM tree of the question
    return html;
  },
  renderResult: function() {
  
    // Return a virtual DOM tree of the result
    return h('p', 'Your answer is ' + (this.state.isRightAnswer ? 'right' : 'wrong') + '!');
  },
  addToState: {
  
    // We add a property we are going to use later to the state of the question
    selected: []
  },
  canAnswer: function() {
  
    // Return true if the question can be answered
    return this.state.selected.length > 0;
  },
  isRightAnswer: function() {
  
    // Return true if the answer was right
    return !_.difference(this.selected, this.rightAnswer).length;
  }
});
```

The questionnaire has to have a name, an introduction and an array of questions. A question has to have a type and a text. You can add properties to a question that are going to be used in your questionnaire. Your questionnaire may look like this:

```
{
  name:      'Name of your questionnaire',
  intro:     'Intro of your questionnaire',
  questions: [
    {
      type: 'single',
      text: 'What is 3 + 2?',
      
      // We add an array of possible answers we can iterate over in our renderQuestion function
      answers: ["1", "3", "3,5", "5"],
      
      // We add an array containing the right answer to this question so we can validate the answer
      rightAnswer: ["5"] 
    },
    {
      type: 'single',
      text: 'What is 1 + 2?',
      answers: ["1", "3", "3,5", "5"],
      rightAnswer: ["3"]
    },
    {
      type: 'single',
      text: 'What is 1 x 2?',
      answers: ["1", "2", "3,5", "5"],
      rightAnswer: ["2"]
    }
  ]
}
```

## Building

Install all dependencies via [npm](https://npmjs.org):

```
npm install
```

Execute the test suite to run the tests in the browser:

```
grunt auto-test
```

Go to [localhost:9876/debug.html](http://localhost:9876/debug.html) to inspect the tests in the browser.

## License

MIT
