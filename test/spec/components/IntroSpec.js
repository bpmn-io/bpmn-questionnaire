'use strict';

// chai-virtual-dom
var chaiVirtualDom    = require('chai-virtual-dom');
chai.use(chaiVirtualDom);

// virtual-dom
var h                 = require('virtual-dom/h');

// Get components
var BpmnQuestionnaire = require('../../../lib/BpmnQuestionnaire'),
    Intro             = require('../../../lib/components/Intro');

// Get test helpers
var TestContainer     = require('mocha-test-container-support'),
    TestHelper        = require('../../TestHelper');

describe('Intro', function() {

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
  
  it('create an instance of the Intro component', function() {

    // Create instance
    var intro = new Intro(questionnaire);

    expect(intro).to.be.an.instanceof(Intro);

  });

  it('should render the Intro component', function() {

    var intro = new Intro(questionnaire).render(questionnaire.state);

    var expected = 
      h('div.bpmn-questionnaire-intro.row', 
        h('div.col-sm-12', [
          h('h2'),
          h('p')  
        ])
      );

    // Check if intro has actual content
    expect(intro).to.look.like(expected);

  });

});