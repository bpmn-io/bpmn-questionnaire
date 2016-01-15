'use strict';

// virtual-dom
var h             = require('virtual-dom/h');

// Get components
var BpmnQuestionnaire = require('../../lib/BpmnQuestionnaire'),
    Intro             = require('../../../lib/components/Intro');

// Get test helpers
var TestContainer = require('mocha-test-container-support'),
    TestHelper    = require('../TestHelper');

describe('Intro', function() {

  var questionnaire;

  beforeEach(functio() {

    //Create a new instance of BpmnQuestionnaire
    questionnaire = new BpmnQuestionnaire({
      container: element,
      questionnaireJson: questionnaireJson
    });

  });

  // Require JSON file of a questionnaire
  var questionnaireJson = require('../fixtures/json/questionnaire/bpmn-questionnaire-basic.json');
  questionnaireJson = JSON.parse(questionnaireJson);
  
  it('create an instance of the Intro component', function() {

    // Create instance
    var intro = new Intro(questionnaire);

    expect(intro).to.be.an.instanceof(Intro);

  });

  it('should render the Intro component', function() {

    var intro = new Intro(questionnaire);

    var tree = intro.render(questionnaire.state);

    expect(tree).to.exist;

  });

});