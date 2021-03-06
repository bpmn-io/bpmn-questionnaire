'use strict';

// virtual-dom
var h                 = require('virtual-dom/h');

// main-loop
var mainLoop          = require('main-loop');

// events
var EventEmitter      = require('events');

// seamless-immutable
var Immutable         = require('seamless-immutable');

// lodash
var assign            = require('lodash/assign'),
    clone             = require('lodash/clone'),
    has               = require('lodash/has');

// Components
var Controls          = require('./components/Controls.js'),
    Diagram           = require('./components/Diagram.js'),
    Intro             = require('./components/Intro.js'),
    Progress          = require('./components/Progress.js'),
    Results           = require('./components/Results.js');

// Services
var Translator        = require('./services/Translator.js');

// Utils
var calculateProgress = require('./util/calculateProgress.js');

/**
 * Creates a new instance of a questionnaire and appends it to a container element.
 *
 * @constructor
 * @param {Object} options - Options.
 * @param {Object} options.questionnaireJson - Questionnaire.
 * @param {Object} options.types - Types.
 * @param {Object|string} - options.container - Element or ID of element that's going to contain the questionnaire.
 */
function BpmnQuestionnaire(options) {

  // Check if options was provided
  if (!options) {
    throw new Error('No options provided');
  }

  if (has(options, 'questionnaireJson')) {
    this.questionnaireJson = options.questionnaireJson;
  } else {

    // Report error
    throw new Error('No questionnaire specified');
  }

  // Events
  this.events = new EventEmitter();

  // Services
  this.services = {
    translator: (function(){
      var translator;

      if(has(options, 'plugins.translator')) {
        // translator = new Translator(options.plugins.translator)
        translator = new Translator(options.plugins.translator);
      } else {
        translator = new Translator();
      }

      return translator.translate.bind(translator);
    }())
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
        throw new Error('Type not specified');
      } else {

        // Add instance of question to array of questions
        that.questions.push(
          new that.types[question.type](index, question, that)
        );
      }
    });
  } else {

    // Report error
    throw new Error('No questions specified');
  }

  // Initial state is immutable
  this.initState = Immutable({
    currentQuestion: 0,
    progress:        0,
    view:            'intro'
  });

  // Set state to mutable copy of initial state
  this.state = this.initState.asMutable({deep: true});

  // Set up loop
  this.loop = mainLoop(this.state, this.render.bind(this), {
    create: require("virtual-dom/create-element"),
    diff:   require("virtual-dom/diff"),
    patch:  require("virtual-dom/patch")
  });

  // Check if container element was specified
  if (!options.container) {
    throw new Error('No container element specified');
  }

  // Append questionnaire to container element
  if (typeof options.container === 'string') {

    // Search for element with given ID
    var container = document.getElementById(options.container);

    // Error handling
    if (!container) {
      throw new Error('Container element not found');
    }

    this.container = container;
  } else if (options.container.appendChild) {

    // Append questionnaire
    this.container = options.container;
  } else {
    throw new Error('Container element not found');
  }

  // Append questionnaire
  this.container.appendChild(this.loop.target);
}

/**
 * Renders questionnaire based on global state.
 *
 * @param {Object} state - State of BpmnQuestionnaire instance.
 * @param {string} state.view - Current view.
 * @returns {Object} html - Virtual DOM tree of questionnaire.
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

  var html =
    h('div.bpmn-questionnaire',
      h('div.container-fluid', content)
    );

  return html;
};

/**
 * Update state of BpmnQuestionnaire instance. Kicks off rendering.
 *
 * @param {Object} options - Updates.
 * @param {boolean} equal - Set state equal to options.
 */
BpmnQuestionnaire.prototype.update = function(options, equal) {

  // Always clone to prevent mutation
  options = clone(options);

  if(equal) {

    // Set state equal to options
    this.state = options;
  } else {

    // Update state
    assign(this.state, options);
  }

  // Finally push updated state to main-loop
  this.loop.update(this.state);

  if (this.state.view === 'results') {

    // Spit out results
    this.emit('results', this.getResults());
  }

};

/** Reset global state of questionnaire. */
BpmnQuestionnaire.prototype.resetQuestionnaire = function() {

  // Reset global state to initial state
  this.update(this.initState, true);

  // Reset all questions
  this.questions.forEach(function(question) {
    question.resetQuestion();
  });
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
 * Returns an instance of a service
 *
 * @param {String} service - Name of requested service.
 */
BpmnQuestionnaire.prototype.get = function(service) {

  if(has(this.services, service)) {
    return this.services[service];
  } else {
    throw new Error('No such service');
  }

}

/**
 * Returns the results of a questionnaire.
 */
BpmnQuestionnaire.prototype.getResults = function() {
  if (this.state.view === 'results') {
    return this.questions.map(function(question) {
      return {
        index: question.index,
        rightAnswer: question.state.rightAnswer
      };
    });
  }
};

/**
 * Adds a listener for an event.
 */
BpmnQuestionnaire.prototype.on = function(event, handler) {
  this.events.on(event, handler);
};

/**
 * Removes a listener for an event.
 */
BpmnQuestionnaire.prototype.off = function(event, callback) {
  this.events.off(event);
};

/**
 * Emits an event.
 */
BpmnQuestionnaire.prototype.emit = function(event) {
  var args = Array.prototype.slice.apply(arguments);

  this.events.emit.apply(this.events, args);
}

/**
 * Static method that creates a type given a type specification.
 *
 * @param {Object} spec - Type specification.
 * @param {} spec.renderQuestion - Function that renders question.
 * @param {} spec.renderResult - Function that renders result of question.
 * @param {} spec.checkIfValidAnswer - Function that checks if answer is valid.
 * @param {} spec.checkIfRightAnswer - Function that checks if answer is right.
 * @param {Object} [undefined] spec.addToState - Object with properties that are added to state of question.
 * @returns {} Question - Question constructor.
 * @public
 */
BpmnQuestionnaire.createType = function(spec) {

  // Return if any of the required functions hasn't been specified
  if (!spec.renderQuestion || !spec.renderResult || !spec.checkIfValidAnswer || !spec.checkIfRightAnswer) {
    throw new Error('You must specify the following functions: renderQuestion, renderResult, checkIfValidAnswer, checkIfRightAnswer');
  }

  /**
   * Contructor function that serves as a base for every type.
   * Methods and properties defined in spec will be assigned to the prototype of this constructor.
   *
   * @param {number} index - Index of question inside the array of questions.
   * @param {Object} options - Object containing the actual question.
   * @param {Object} questionnaire - Reference to the questionnaire instance.
   */
  var Question = function (index, options, questionnaire) {

    this.index         = index;
    this.options       = options;
    this.questionnaire = questionnaire;
    if (options.diagram) {
      this.diagram = new Diagram(index, options.diagram, this);
    }

    // Initial state is immutable
    this.initState = Immutable({
      validAnswer: false,
      rightAnswer: false,
      view:        'question'
    });

    // Prevent overwriting default properties of state and assign provided properties to initial state
    if (has(spec, 'addToState')) {
      if(!has(spec.addToState, 'validAnswer')
        && !has(spec.addToState, 'rightAnswer')
        && !has(spec.addToState, 'view')) {

          // Merge immutable with object
          this.initState = this.initState.merge(spec.addToState);
      }
    }

    // Set state to mutable copy of initial state
    this.state = this.initState.asMutable({deep: true});

  };

  /**
   * Renders question depending on state.
   * Doesn't take any state as input since it has access to it's own state by default.
   *
   * @return {Object} - Virtual DOM tree of question.
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

    return (
      h('div.bpmn-questionnaire-question.row',
        h('div.col-md-12',
          content
        )
      )
    );
  };

  /**
   * Updates state of question.
   *
   * @param {Object} options - Updates.
   * @param {boolean} equal - Set state equal to options.
   */
  Question.prototype.update = function(options, equal) {

    // Always clone to prevent mutation
    options = clone(options);

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

  /** Resets state of question. */
  Question.prototype.resetQuestion = function() {
    this.update(this.initState, true);

    if (this.diagram) {
      this.diagram.resetDiagram();
    }

  };

  /** Answers the question by setting the state to answered and checking if the answer was right. */
  Question.prototype.answer = function() {
    this.update({
      view: 'result',
      rightAnswer: spec.checkIfRightAnswer.apply(this)
    });
  };

  return Question;
};

module.exports = BpmnQuestionnaire;
