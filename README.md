# bpmn-questionnaire

<img style="height: 15px" src="/resources/img/logo.png">

__Note: This library is in early development stage.__

A library for questionnaires on BPMN 2.0.

## About

* Create and embed questionnaires on BPMN 2.0 in your own website. 
* Implement your own types of questions with ease.
* This library uses [bpmn-js](https://github.com/bpmn-io/bpmn-js) to render BPMN 2.0 diagrams. 


## Example

[__Check out an example project__](https://github.com/PHILIPPFROMME/bpmn-questionnaire-example)

Create a questionnaire:

```javascript
var q = new BpmnQuestionnaire({
  container: element,
  questionnaireJson: questionnaireJson,
  types: {
    single: s
  }
});
```

Create a type:

```javascript
var single = BpmnQuestionnaire.createType({
  renderQuestion: function() {
    var that = this;
    var buttons = [];
    this.options.answers.forEach(function(answer) {
      buttons.push(
        h('button', {
          className: 'btn btn-block' + (that.state.selected.indexOf(answer) !== -1 ? ' btn-success' : ''), 
          onclick: function() {
            that.update({
              selected: [answer]
            });
          },
          style: {
            marginTop:    '5px',
            marginBottom: '5px'
          }
        }, answer)
      );
    });

    var html = 
      h('div', [
        h('p', this.options.text),
        this.diagram.render(this.state),
        h('div', {
          style: {
            marginTop: '20px'
          }
        }, buttons)
      ]);

    return html;
  },
  renderResult: function() {
    var html;

    if (this.state.rightAnswer) {
      html = 
        h('div.panel.panel-success', [
            h('div.panel-heading',
              h('h3.panel-title', 'Glückwunsch!')
            ),
            h('div.panel-body', 'Sie haben diese Frage richtig beantwortet!')
        ]);
    } else {
      html =
        h('div.panel.panel-danger', [
            h('div.panel-heading',
              h('h3.panel-title', 'Oh nein!')
            ),
            h('div.panel-body', 'Ihre Antwort war leider falsch! Die richtige Antwort lautet: ' +
              this.options.rightAnswer[0])
        ]);
    }

    return html;
  },
  checkIfValidAnswer: function() {
    return this.state.selected.length > 0;
  },
  checkIfRightAnswer: function() {
    return difference(this.options.rightAnswer, this.state.selected).length < 1;
  },
  addToState: {
    selected: []
  }
});
```

JSON of your questionnaire may look like this:

```javascript
{  
   "name":"BPMN 2.0 Grundlagen",
   "intro":"Testen Sie ihr Wissen zu BPMN 2.0. Viel Erfolg!",
   "questions":[  
      {  
         "type":"single",
         "text":"Der unten stehende Prozess wird gestartet. Wie lange lebt die Prozessinstanz?",
         "answers":[  
            "10 Minuten",
            "45 Minuten",
            "50 Minuten",
            "75 Minuten"
         ],
         "rightAnswer":[  
            "45 Minuten"
         ],
         "diagram":{  
            "url":"https://raw.githubusercontent.com/bpmn-io/bpmn-js-examples/master/simple-bower/resources/pizza-collaboration.bpmn",
            "interactive":false
         }
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
