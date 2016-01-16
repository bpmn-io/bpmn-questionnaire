'use strict';

// virtual-dom
var h                 = require('virtual-dom/h');

// Get components
var BpmnQuestionnaire = require('../../../lib/BpmnQuestionnaire'),
    Controls          = require('../../../lib/components/Controls');

// Get test helpers
var TestContainer     = require('mocha-test-container-support'),
    TestHelper        = require('../../TestHelper');

describe('Controls', function() {

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
  
  it('create an instance of the Controls component', function() {

    // Create instance
    var controls = new Controls(questionnaire);

    expect(controls).to.be.an.instanceof(Controls);

  });

  it('should render the Controls component', function() {

    var controls = new Controls(questionnaire);

    var tree = controls.render(questionnaire.state);

    // Check for existance of DOM element
    expect(tree.properties.className).to.equal('bpmn-questionnaire-controls bpmn-questionnaire-u-5-5');

    // Check if intro has actual content
    expect(tree.children).to.have.length.above(0);

  });

});