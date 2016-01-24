'use strict';

// chai-virtual-dom
var chaiVirtualDom    = require('chai-virtual-dom');
chai.use(chaiVirtualDom);

// virtual-dom
var h                 = require('virtual-dom/h');

// Get components
var BpmnQuestionnaire = require('../../../lib/BpmnQuestionnaire'),
    Progress          = require('../../../lib/components/Progress');

// Get test helpers
var TestContainer     = require('mocha-test-container-support'),
    TestHelper        = require('../../TestHelper');

describe('Progress', function() {

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

  it('should render the Progress component', function() {

    // Render progress
    var tree = Progress.render(questionnaire.state);
    
    // Render expected tree
    var expected =
      h('div.bpmn-questionnaire-row',
        h('div', {
          'className': 'bpmn-questionnaire-progress'
            + (questionnaire.state.progress === 100 ? ' bpmn-questionnaire-success' : '')
          },
          h('div.bpmn-questionnaire-progress-meter')
        )
      );

    // Compare the two
    expect(tree).to.look.like(expected);
  });

});