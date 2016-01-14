'use strict';

// Get the contructor function
var BpmnQuestionnaire = require('../../lib/BpmnQuestionnaire'),
    TestContainer     = require('mocha-test-container-support'),
    TestHelper        = require('../TestHelper');

describe('creating a new questionnaire', function() {

  var testContentContainer,
      element;
      
  // Require JSON file of a questionnaire
  var questionnaireJSON = require('../fixtures/json/questionnaire/bpmn-questionnaire-basic.json');

  beforeEach(function() {

    // Add test container
    testContentContainer = TestContainer.get(this);

    // Create new DOM element with an id and assign to container
    element = document.createElement('div');

    // Append the container element to the test container element
    testContentContainer.appendChild(element);
  });

  it('should create a new instance of BpmnQuestionnaire given a DOM element as container and a JSON file of a questionnaire', function() {
    
    var questionnaire = new BpmnQuestionnaire({
      container: element,
      json: questionnaireJSON
    });

    // Check for new instance
    expect(questionnaire).to.be.an.instanceof(BpmnQuestionnaire);

    // Check if JSON was assigned as property to new instance
    expect(questionnaire.json).to.equal(questionnaireJSON);
  });

  it('should create a new instance of BpmnQuestionnaire given an id of the container and a JSON file of a questionnaire', function() {
    
    // Give our container an ID
    element.setAttribute('id', 'container');

    var questionnaire = new BpmnQuestionnaire({
      container: 'container',
      json: questionnaireJSON
    });

    // Check for new instance
    expect(questionnaire).to.be.an.instanceof(BpmnQuestionnaire);
  });

});