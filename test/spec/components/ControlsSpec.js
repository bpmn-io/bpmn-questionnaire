'use strict';

// chai-virtual-dom
var chaiVirtualDom    = require('chai-virtual-dom');
chai.use(chaiVirtualDom);

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
  
  it('create an instance of the Controls component', function() {

    // Create instance
    var controls = new Controls(questionnaire);

    expect(controls).to.be.an.instanceof(Controls);

  });

  it('should render the Controls component', function() {

    var controls = new Controls(questionnaire).render(questionnaire.state);

    var expected =
      h('div.bpmn-questionnaire-controls.bpmn-questionnaire-row',
        h('div.bpmn-questionnaire-col-md-12', [
          h('div.bpmn-questionnaire-controls-left.bpmn-questionnaire-btn-group.bpmn-questionnaire-pull-sm-left'),
          h('div.bpmn-questionnaire-controls-right.bpmn-questionnaire-btn-group.bpmn-questionnaire-pull-sm-right')
        ])
      );

    expect(controls).to.look.like(expected);

  });

});