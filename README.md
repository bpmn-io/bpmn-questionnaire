# bpmn-questionnaire

<img style="height: 15px" src="/resources/img/logo.png">

__Note: This library is in early development stage.__

A library for questionnaires on BPMN 2.0.

## About

* Create and embed questionnaires on BPMN 2.0 in your own website.
* Implement your own types of questions with ease.
* This library uses [bpmn-js](https://github.com/bpmn-io/bpmn-js) to render BPMN 2.0 diagrams.
* Create your own questionnaires with the [bpmn-questionnaire Builder](https://github.com/bpmn-io/bpmn-questionnaire-builder) application.


## Example

[__Check out an example project__](https://github.com/bpmn-io/bpmn-questionnaire-example)

[__Check out further examples__](https://github.com/philippfromme/bpmn-questionnaire-examples)

### Creating a questionnaire

```javascript
var q = new BpmnQuestionnaire({
  container: element,
  questionnaireJson: questionnaireJson,
  types: {
    single: s
  }
});
```

### Creating a type

[__Check out example types__](https://github.com/bpmn-io/bpmn-questionnaire/tree/master/test/fixtures/js/types)

```javascript
var single = BpmnQuestionnaire.createType({
  renderQuestion: function() {
    // ...
  },
  renderResult: function() {
    // ...
  },
  checkIfValidAnswer: function() {
    // ...
  },
  checkIfRightAnswer: function() {
    // ...
  },
  addToState: {
    // ...
  }
});
```

### Example JSON file of a questionnaire

[__Check out example JSON files__](https://github.com/bpmn-io/bpmn-questionnaire/tree/master/test/fixtures/json/questionnaire)

```javascript
{  
   "name":"BPMN-Grundlagentest",
   "intro":"Bitte beantworten sie die nachfolgenden Fragen.",
   "questions":[  
      {  
         "type":"single",
         // ...
      },
      {  
         "type":"multiple",
         // ...
      },
      {
        "type":"interactive",
        // ...
      },
      // ...
   ]
}
```

To include a BPMN 2.0 diagram in a question add a `diagram` property to it.

```
"diagram":{  
  "url":"https://raw.githubusercontent.com/bpmn-io/bpmn-questionnaire/master/test/fixtures/bpmn/diagram-1.bpmn",
  "interactive":true,
  "singleSelect":true,
  "rightAnswers":[
     "IntermediateCatchEvent_1r9cp4a",
     "InclusiveGateway_1jd0hrf",
     "EndEvent_0diucuw",
     "IntermediateThrowEvent_03x03k5"
  ],
  "noSelect":{
     "elements":[
     ],
     "types":[
        "label",
        "participant"
     ]
  }
}
```

You can either provide a URL of a diagram via `url` or inline it via `xml`. Diagrams are not interactive by default. If you want your diagram to be interactive set `interactive` to true. Thus interaction is enabled. Add the IDs of all elements that belong to the right answer to `rightAnswers`. Via `noSelect` you can specify element IDs or types of BPMN 2.0 elements that will not be selectable. Via `singleSelect` you can specify if only one ore multiple elements can be selected at the same time.

## Building

Install all dependencies via [npm](https://npmjs.org):

```
npm install
```

Execute the test suite to run the tests in the browser:

```
grunt auto-test
```

Build the project:

```
grunt auto-build
```

## CSS

The library uses [Bootstrap 3](https://github.com/twbs/bootstrap) for styling. You can either include Bootstrap in your application or build a namespaced version of Bootstrap:

```
grunt build-css
```

Go to [localhost:9876/debug.html](http://localhost:9876/debug.html) to inspect the tests in the browser.

## License

MIT
