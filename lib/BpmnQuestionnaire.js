'use strict';

// virtual-dom
var h                 = require('virtual-dom/h');

// main-loop
var mainLoop          = require('main-loop');

// lodash
var assign            = require('lodash/assign');

// Components
var Intro             = require('./components/Intro.js'),
    Questions         = require('./components/Questions.js'),
    Results           = require('./components/Results.js');

// Utils
var calculateProgress = require('./util/calculateProgress.js');

/**
 * Creates a new instance of a questionnaire and attaches it to specified element.
 *
 * This function exposes the following functions to be used from outside:
 * update             - Updates global state and pushes it to main-loop for rerendering.
 * render             - Returns virtual dom of questionnaire.
 * nextQuestion       - Go to next question.
 * previousQuestion   - Go to previous question.
 * resetQuestionnaire - Reset the questionnaire.
 * 
 * @param {Object} options - Configurations.
 */
function BpmnQuestionnaire(options) {

  // Check if options was provided
  if (!options) {
    console.log('Error: No options provided');
  }

  if (options.questionnaireJson) {
    this.questionnaireJson = options.questionnaireJson;
  } else {

    // Report error
    console.log('Error: No questionnaire specified');
  }

  // Global app state initialization
  this.initState = {
    currentQuestion: 0,
    progress:        0,
    view:            'intro',
    results:         {}
  };

  // Set state to initial state by cloning instead of referencing
  this.state = assign({}, this.initState);

  // Set up loop
  this.loop = mainLoop(this.state, this.render.bind(this), {
    create: require("virtual-dom/create-element"),
    diff:   require("virtual-dom/diff"),
    patch:  require("virtual-dom/patch")
  });

  // Check if container element was specified
  if (!options.container) {
    console.log('Error: No container element specified');
  }

  // Append questionnaire to container element
  if (typeof options.container === 'string') {

    // Search for element with given ID
    var container = document.getElementById(options.container);

    // Error handling
    if (!container) {
      console.log('Error: Container element not found');
    }
    
    this.container = container;
  } else if (options.container.appendChild) {

    // Append questionnaire
    this.container = options.container;
  } else {
    console.log('Error: Container element not found');
  }

  // Append questionnaire
  this.container.appendChild(this.loop.target);
}

/**
 * Renders questionnaire based on global state.
 *
 * @param {Object} state - Global app state. 
 */
BpmnQuestionnaire.prototype.render = function(state) {
  
  // Render content based on global app state
  var content;

  switch (state.view) {
    case 'intro':

      // Render intro
      content = new Intro(this).render(state);
      break;
    case 'questions':

      // Render questions
      content = new Questions(this).render(state);
      break;
    case 'results':

      // Render results
      content = new Results(this).render(state);
      break;
  }
  
  var html = h('div.bpmn-questionnaire', 
    h('div.bpmn-questionnaire-questionnaire', content)
  ); 

  return html;
};

/**
 * Update global app state. Questionnaire gets rerendered after.
 *
 * @param {Object} options - Updates.
 * @param {Boolean} equal - Set state equal to options.
 */
BpmnQuestionnaire.prototype.update = function(options, equal) {

  // Always use assign in case someone passed in a reference to an object so the object will not be mutated
  if(equal) {

    // Set state equal to options
    this.state = assign({}, options);
  } else {
    
    // Update state
    assign(this.state, options);
  }

  // Finally push updated state to main-loop
  this.loop.update(this.state);
};

/**
 * Reset global state of questionnaire.
 */
BpmnQuestionnaire.prototype.resetQuestionnaire = function() {

  // Reset global state to initial state
  this.update(this.initState, true);
};

/**
 * Go to previous question.
 * This method could be omitted but for the sake of the public API it's not.
 */
BpmnQuestionnaire.prototype.previousQuestion = function() {
  
  // Decrease index of current question
  this.update({
    currentQuestion: Math.max(this.loop.state.currentQuestion - 1, 0)
  });

  // Calculate progress based on current question
  this.update({
    progress: calculateProgress(this.loop.state.currentQuestion, this.questionnaireJson.questions.length)
  });
};

/**
 * Go to next question.
 * This method could be omitted but for the sake of the public API it's not.
 */
BpmnQuestionnaire.prototype.nextQuestion = function() {

  // Increase index of current question
  this.update({
    currentQuestion: Math.min(this.loop.state.currentQuestion + 1, this.questionnaireJson.questions.length),
  });

  // Calculate progress based on current question
  this.update({
    progress: calculateProgress(this.loop.state.currentQuestion, this.questionnaireJson.questions.length)
  });
};

module.exports = BpmnQuestionnaire;