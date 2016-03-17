'use strict';

// chai-virtual-dom
var chaiVirtualDom    = require('chai-virtual-dom');
chai.use(chaiVirtualDom);

// virtual-dom
var h                 = require('virtual-dom/h');

// bpmn-questionnaire
var BpmnQuestionnaire = require('../../lib/BpmnQuestionnaire');

// Sample plugin
var plugin            = require('../fixtures/js/plugins/translation.js');

// Test helpers
var TestContainer     = require('mocha-test-container-support'),
    TestHelper        = require('../TestHelper');

// Types
var interactive       = require('../fixtures/js/types/interactive.js'),
    multiple          = require('../fixtures/js/types/multiple.js'),
    single            = require('../fixtures/js/types/single.js');

describe('BpmnQuestionnaire', function() {

  var testContentContainer,
      element,
      questionnaire;

  // Require JSON files of a questionnaires
  var questionnaireJson = require('../fixtures/json/questionnaire/bpmn-questionnaire-basic.json');
  questionnaireJson = JSON.parse(questionnaireJson);

  var questionnaireJsonMultipleTypes = require('../fixtures/json/questionnaire/bpmn-questionnaire-multiple-types.json');
  questionnaireJsonMultipleTypes = JSON.parse(questionnaireJsonMultipleTypes);

  beforeEach(function() {

    // Add test container
    testContentContainer = TestContainer.get(this);

    // Create new DOM element with an id and assign to container
    element = document.createElement('div');

    // Append the container element to the test container element
    testContentContainer.appendChild(element);

    //Create a new instance of BpmnQuestionnaire
    questionnaire = new BpmnQuestionnaire({
      container: element,
      questionnaireJson: questionnaireJsonMultipleTypes,
      types: {
        interactive: interactive,
        multiple:    multiple,
        single:      single
      }
    });

  });

  it('should create a new instance of BpmnQuestionnaire given a DOM element as container and a JSON file of a questionnaire', function() {
    var s = BpmnQuestionnaire.createType({
      renderQuestion:     function() {},
      renderResult:       function() {},
      checkIfValidAnswer: function() {},
      checkIfRightAnswer: function() {}
    });

    var q = new BpmnQuestionnaire({
      container: element,
      questionnaireJson: questionnaireJson,
      types: {
        single: s
      }
    });

    // Check for new instance
    expect(q).to.be.an.instanceof(BpmnQuestionnaire);
  });

  it('should create a new instance of BpmnQuestionnaire given an id of the container and a JSON file of a questionnaire', function() {

    // Give our container an ID
    element.setAttribute('id', 'container');

    var s = BpmnQuestionnaire.createType({
      renderQuestion:     function() {},
      renderResult:       function() {},
      checkIfValidAnswer: function() {},
      checkIfRightAnswer: function() {}
    });

    var q = new BpmnQuestionnaire({
      container: 'container',
      questionnaireJson: questionnaireJson,
      types: {
        single: s
      }
    });

    // Check for new instance
    expect(q).to.be.an.instanceof(BpmnQuestionnaire);

    // Check if JSON was assigned as property to new instance
    expect(q.questionnaireJson).to.equal(questionnaireJson);
  });

  it('should have an initial state that has been assigned to the current state of the questionnaire', function() {
    var s = BpmnQuestionnaire.createType({
      renderQuestion:     function() {},
      renderResult:       function() {},
      checkIfValidAnswer: function() {},
      checkIfRightAnswer: function() {}
    });

    var q = new BpmnQuestionnaire({
      container: element,
      questionnaireJson: questionnaireJson,
      types: {
        single: s
      }
    });

    // Check for initState property
    expect(q.initState).to.exist;

    // Check for state property
    expect(q.state).to.exist;

    // Check if JSON was assigned as property to new instance
    expect(q.initState).to.eql(q.state);
  });

  it('should get appended to the specified container element', function() {
    var s = BpmnQuestionnaire.createType({
      renderQuestion:     function() {},
      renderResult:       function() {},
      checkIfValidAnswer: function() {},
      checkIfRightAnswer: function() {}
    });

    var q = new BpmnQuestionnaire({
      container: element,
      questionnaireJson: questionnaireJson,
      types: {
        single: s
      }
    });

    // Get DOM element of questionnaire
    var questionnaireElement = element.getElementsByClassName('bpmn-questionnaire');

    // Check if questionnaire has been appended to parent node
    expect(questionnaireElement).to.exist;
    expect(q.container).to.equal(element);
  });

  it('should set up main-loop', function() {

    var loop = questionnaire.loop;

    // Check for existance of loop
    expect(loop.state).to.extist;

  });

  it('should render the questionnaire', function() {

    var tree = questionnaire.render(questionnaire.state);

    // Check for existance of DOM element
    expect(tree.properties.className).to.have.string('bpmn-questionnaire');

    // Check if questionnaire has actual content
    expect(tree.children).to.have.length.above(0);

  });

  it('should update the state', function() {

    var update = {foo: 'bar'};

    // Update state with new property
    questionnaire.update(update);

    // Check for property
    expect(questionnaire.state.foo).to.equal('bar');

  });

  it('should reset the state of the questionnaire', function() {

    // Update and than reset state of questionnaire
    questionnaire.update({foo: 'bar'});
    questionnaire.resetQuestionnaire();

    // Check if state was reset to initial state
    expect(questionnaire.initState).to.eql(questionnaire.state);

  });

  it('should increase index of current question', function() {

    // Check if increasing
    expect(questionnaire.nextQuestion.bind(questionnaire)).to.increase(questionnaire.state, 'currentQuestion');

  });

  it('should decrease index of current question', function() {

    // Set index of current question to last question
    questionnaire.update({currentQuestion: questionnaire.questionnaireJson.questions.length});

    // Check if decreasing
    expect(questionnaire.previousQuestion.bind(questionnaire)).to.decrease(questionnaire.state, 'currentQuestion');

  });

  it('should not increase index of current question if current question is last question', function() {

    // Set index of current question to last question
    questionnaire.update({currentQuestion: questionnaire.questionnaireJson.questions.length});

    // Get index of current question
    var currentQuestion = questionnaire.state.currentQuestion;

    // Try to increase
    questionnaire.nextQuestion();

    expect(questionnaire.state.currentQuestion).to.be.equal(currentQuestion);

  });

  it('should not decrease index of current question if current question is first question', function() {

    // Get index of current question
    var currentQuestion = questionnaire.state.currentQuestion;

    // Try to increase
    questionnaire.previousQuestion();

    expect(questionnaire.state.currentQuestion).to.be.equal(currentQuestion);

  });

  it('should return an instance of the requested service', function() {
    var service = questionnaire.get('translator');

    expect(service).not.to.be.undefined;
  });

  it('should throw an error if the requested service does not exist', function() {
    var get = questionnaire.get.bind(questionnaire, 'nope');

    expect(get).to.throw('No such service');
  });

  it('should have a translation service', function() {
    var t = questionnaire.get('translator');

    expect(t).to.be.exist;
  });

  it('should be possible to use the translation service without a plugin', function() {
    var t = questionnaire.get('translator');
    var translation = t('Next');

    expect(translation).to.equal('Next');
  });

  it('should be possible to use the translation service with a plugin', function() {
    plugin.setLanguage('de');
    plugin.addLanguage('de', {
      'Start':        'Beginnen',
      'Back':         'Zurück',
      'Skip':         'Überspringen',
      'Check answer': 'Antwort überprüfen',
      'Next':         'Weiter',
      'View results': 'Ergebnisse ansehen',
      'Start over':   'Von vorne beginnen'
    });

    var s = BpmnQuestionnaire.createType({
      renderQuestion:     function() {},
      renderResult:       function() {},
      checkIfValidAnswer: function() {},
      checkIfRightAnswer: function() {}
    });

    var q = new BpmnQuestionnaire({
      container: element,
      questionnaireJson: questionnaireJson,
      types: {
        single: s
      },
      plugins: {
        translator: plugin.t
      }
    });

    var t = q.get('translator');
    var translation = t('Start');

    expect(translation).to.equal('Beginnen');
  });

  it('should return the results of a questionnaire', function() {
    questionnaire.update({
      view: 'results'
    });

    var results = questionnaire.getResults();

    expect(results).not.to.be.undefined;
  });

  it('should register an event handler', function() {
    var test = false;

    questionnaire.on('test', function() {
      test = true;
    });

    questionnaire.emit('test');

    expect(test).to.be.true;
  });

  it('should emit a "results" event if the results are displayed', function() {
    var test;

    questionnaire.on('results', function(results) {
      test = results;
    });

    questionnaire.update({
      view: 'results'
    });

    expect(test).not.to.be.undefined;
  });

  it('should throw an error if any of the required functions is not specified when creating a type', function() {

    var type = function() {
      return BpmnQuestionnaire.createType({
        // Missing functions
      });
    };

    // Should throw an error
    expect(type).to.throw(Error);

  });

  it('should create a type by returning a constructor function', function() {

    var type = BpmnQuestionnaire.createType({
      renderQuestion:     function() {},
      renderResult:       function() {},
      checkIfValidAnswer: function() {},
      checkIfRightAnswer: function() {}
    });

    // Should return the constructor
    expect(type).to.be.a('function');

  });

});
