'use strict';

// virtual-dom
var h                 = require('virtual-dom/h');

// main-loop
var mainLoop          = require('main-loop');

// lodash
var assign            = require('lodash/assign'),
    cloneDeep         = require('lodash/cloneDeep'),
    has               = require('lodash/has');

// Components
var Controls          = require('./components/Controls.js'),
    Intro             = require('./components/Intro.js'),
    Progress          = require('./components/Progress.js'),
    Results           = require('./components/Results.js');

// Utils
var calculateProgress = require('./util/calculateProgress.js');

/**
 * Creates a new instance of a questionnaire and attaches it to specified element.
 *
 * This function has the following properties:
 * -------------------------------------------
 * {object} questionnaireJson - JSON file of the specified questionnaire.
 * {object} initState         - Initial state.
 * {object} state             - Current state.
 * {object} loop              - Main loop provided by main-loop.
 * {DOM element} container    - Parent element of questionnaire.
 *
 * This function exposes the following functions to be used from outside:
 * ----------------------------------------------------------------------
 * update             - Updates global state and pushes it to main-loop for rerendering.
 * render             - Returns virtual dom of questionnaire.
 * nextQuestion       - Go to next question.
 * previousQuestion   - Go to previous question.
 * resetQuestionnaire - Reset the questionnaire.
 * 
 * @param {object} options - Configurations.
 */
function BpmnQuestionnaire(options) {

  // Check if options was provided
  if (!options) {
    console.log('Error: No options provided');
    return;
  }

  if (options.questionnaireJson) {
    this.questionnaireJson = options.questionnaireJson;
  } else {

    // Report error
    console.log('Error: No questionnaire specified');
    return;
  }

  // Check if types were provided
  if (options.types) {
    this.types = options.types;
  }

  // Check if questions were provided
  if (this.questionnaireJson.questions.length) {
    this.questions = [];
    var that = this;
  
    // Create questions
    this.questionnaireJson.questions.forEach(function(question, index) {
      
      // Check if type of question was provided
      if (!typeof that.types[question.type] === 'function') {

        // Report error
        console.log('Error: Type not specified');
        return;
      } else {
        
        // Add instance of question to array of questions
        that.questions.push(
          new that.types[question.type](index, question, that)
        );
      }
    });
  } else {

    // Report error
    console.log('Error: No questions specified');
    return;
  }

  // Global app state initialization
  this.initState = {
    currentQuestion: 0,
    progress:        0,
    view:            'intro'
  };

  // Set state to initial state by cloning instead of referencing
  this.state = cloneDeep(this.initState);

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
 * @param {object} state - Global app state. 
 */
BpmnQuestionnaire.prototype.render = function(state) {
  
  // Render content depending on global app state
  var content;

  switch (state.view) {
    case 'intro':

      // Render intro
      content = [
        new Intro(this).render(state),
        new Controls(this).render(state)
      ];
      break;
    case 'questions':

      // Render questions
      content = [
        Progress.render(state),
        this.questions[this.state.currentQuestion].render(),
        new Controls(this).render(state)
      ];
      break;
    case 'results':

      // Render results
      content = [
        Progress.render(state),
        new Results(this).render(state),
        new Controls(this).render(state)
      ]
      break;
  }
  
  var html = h('div.bpmn-questionnaire', 
    h('div.bpmn-questionnaire-questionnaire.bpmn-questionnaire-container-fluid', content)
  ); 

  return html;
};

/**
 * Update global app state. Questionnaire gets rerendered after.
 * To trigger an update and rerendering without the state beeing changed just call this function with an empty object like update({}).
 *
 * @param {object} options - Updates.
 * @param {boolean} equal - Set state equal to options.
 */
BpmnQuestionnaire.prototype.update = function(options, equal) {

  // Always clone to prevent mutation
  options = cloneDeep(options);

  if(equal) {

    // Set state equal to options
    this.state = options;
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

  // TODO Reset state of all questions
  
  /*
  this.questions.forEach(function(question) {
    question.resetQuestion();
  };
  */
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

/**
 * Static method that creates a type given a type specification.
 *
 * @param {object} spec Type specification (which must define 'renderQuestion', 'renderResult', , 'checkIfCanAnswer' and 'checkAnswer').
 * @return {function} Question - Question constructor function.
 * @public
 */
BpmnQuestionnaire.createType = function(spec) {
  
  // Return if any of the required functions hasn't been specified
  if (!spec.renderQuestion || !spec.renderResult || !spec.checkIfValidAnswer || !spec.checkIfRightAnswer) {
    console.log('Error: You must specify the following functions: renderQuestion, renderResult, checkIfValidAnswer, checkIfRightAnswer');
    return;
  }
  
  /**
   * Contructor function that serves as a base for every type.
   * Methods and properties defined in spec will be assigned to the prototype of this constructor.
   *
   * @param {number} index - Index of question inside the array of questions.
   * @param {object} options - Object containing the actual question.
   * @param {BpmnQuestionnaire} questionnaire - Reference to the questionnaire instance. 
   */
  var Question = function (index, options, questionnaire) {
  
    this.index         = index;
    this.options       = options;
    this.questionnaire = questionnaire;
    
    // Initial state
    this.initState = {
      validAnswer: false,
      view:       'question'
    };

    // Prevent overwriting default properties of state and assign provided properties to initial state
    if(!has(spec.addToState, 'validAnswer')
      && !has(spec.addToState, 'rightAnswer')
      && !has(spec.addToState, 'view')) {
        assign(this.initState, cloneDeep(spec.addToState));
    }

    // Set state to initial state  
    this.state = cloneDeep(this.initState);
  
  };

  /**
   * Renders question depending on state.
   * Doesn't take any state as input since it has access to it's own state by default.
   *
   * @return {VTree} Vtree of question.
   */
  Question.prototype.render = function() {

    // Render content depending on question state
    var content;

    switch (this.state.view) {
      case 'question':

        // Apply function to Question
        content = spec.renderQuestion.apply(this);
        break;
      case 'result':
        content = spec.renderResult.apply(this);
        break;
    }

    // Return question wrapped properly
    return (
      h('div.bpmn-questionnaire-question.bpmn-questionnaire-row',
        h('div.bpmn-questionnaire-col-md-12',
          content
        )
      )  
    );
  };

  /**
   * Updates state of question.
   *
   * @param {object} options - Updates.
   * @param {boolean} equal - Set state equal to options.
   */
  Question.prototype.update = function(options, equal) {
  
    // Always clone to prevent mutation
    options = cloneDeep(options);
    
    if(equal) {

      // Set state equal to options
      this.state = options;
    } else {
    
      // Update state
      assign(this.state, options);
    }
    
    // Check if question can be answered
    if (spec.checkIfValidAnswer.apply(this)) {
      assign(this.state, {
        validAnswer: true
      });
    }
  
    // Kick off rerendering of questionnaire
    this.questionnaire.update({});
  };

  /**
   * Resets state of question.
   */
  Question.prototype.resetQuestion = function() {
    this.update(this.initState, true);
  };
  
  /**
   * Answers the question by setting the state to answered and checking if the answer was right.
   */
  Question.prototype.answer = function() {
    this.update({
      view: 'result',
      rightAnswer: spec.checkIfRightAnswer.apply(this)
    });
  };

  return Question;
};

module.exports = BpmnQuestionnaire;