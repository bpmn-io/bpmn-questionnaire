'use strict';

// chai-virtual-dom
var chaiVirtualDom    = require('chai-virtual-dom');
chai.use(chaiVirtualDom);

// virtual-dom
var h                 = require('virtual-dom/h');

// Get components
var BpmnQuestionnaire = require('../../../lib/BpmnQuestionnaire'),
    Results           = require('../../../lib/components/Results');

// Get test helpers
var TestContainer     = require('mocha-test-container-support'),
    TestHelper        = require('../../TestHelper');

describe('Results', function() {

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

    // Create a new type
    var single = BpmnQuestionnaire.createType({
      renderQuestion:     function() {},
      renderResult:       function() {},
      checkIfValidAnswer: function() {},
      checkIfRightAnswer: function() {}
    });

    //Create a new instance of BpmnQuestionnaire
    questionnaire = new BpmnQuestionnaire({
      container: element,
      questionnaireJson: questionnaireJson,
      types: {
        single: single
      }
    });

  });

  // Require JSON file of a questionnaire
  var questionnaireJson = require('../../fixtures/json/questionnaire/bpmn-questionnaire-basic.json');
  questionnaireJson = JSON.parse(questionnaireJson);
  
  it('create an instance of the Results component', function() {

    // Create instance
    var results = new Results(questionnaire);

    expect(results).to.be.an.instanceof(Results);

  });

  it('should render the Results component', function() {

    var results = new Results(questionnaire).render(questionnaire.state);

    var expected =
      h('div.bpmn-questionnaire-results.bpmn-questionnaire-row',
        h('div.bpmn-questionnaire-col-md-12', [
          h('h2')
        ])
      );

    // Check if intro has actual content
    expect(results).to.look.like(expected);

  });

});