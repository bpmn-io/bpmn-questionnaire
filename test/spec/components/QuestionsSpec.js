'use strict';

// virtual-dom
var h                 = require('virtual-dom/h');

// Get components
var BpmnQuestionnaire = require('../../../lib/BpmnQuestionnaire'),
    Questions         = require('../../../lib/components/Questions');

// Get test helpers
var TestContainer     = require('mocha-test-container-support'),
    TestHelper        = require('../../TestHelper');

describe('Questions', function() {

  var testContentContainer,
      element,
      questionnaire;

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
      questionnaireJson: questionnaireJson
    });

  });

  // Require JSON file of a questionnaire
  var questionnaireJson = require('../../fixtures/json/questionnaire/bpmn-questionnaire-basic.json');
  questionnaireJson = JSON.parse(questionnaireJson);
  
  it('create an instance of the Questions component', function() {

    // Create instance
    var questions = new Questions(questionnaire);

    expect(questions).to.be.an.instanceof(Questions);

  });

  it('should render the Questions component', function() {

    var questions = new Questions(questionnaire);

    var tree = questions.render(questionnaire.state);

    // Check if array of DOM elements was returned
    expect(tree).to.have.length.above(0);

    // Check if 3 DOM elements were returned
    expect(tree.length).to.equal(3);

  });

});