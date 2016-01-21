[![Stories in Ready](https://badge.waffle.io/PHILIPPFROMME/bpmn-questionnaire.png?label=ready&title=Ready)](https://waffle.io/PHILIPPFROMME/bpmn-questionnaire)
# bpmn-questionnaire

<img style="height: 15px" src="/resources/img/logo.png">

__Note: This library is in very early development stage and therefore not usable.__

A library for questionnaires on BPMN 2.0.

## About

Create and embed questionnaires on BPMN 2.0 in your own website. 
Implement your own types of questions with ease.

## Example Use

```
var q = new BpmnQuestionnaire({
  questionnaire: questionnaire, // Your questionnaire
  types: { // Your types
    single: single
    multiple: multiple
  }
});
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
