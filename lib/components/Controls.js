'use strict';

var h      = require('virtual-dom/h');

// lodash
var assign = require('lodash/assign');

/**
 * Controls component.
 *
 * @constructor
 * @param {Object} questionnaire - Reference to questionnaire.
 */
function Controls(questionnaire) {
  this.questionnaire = questionnaire;
}

/**
 * Render function of component.
 *
 * @param {Object} state - State of questionnaire.
 * @returns {Object} html - Virtual DOM tree of component.
 */
Controls.prototype.render = function(state) {

  var that = this;

  // Get an instance of translator service
  var t = this.questionnaire.get('translator');

  // Handler functions
  function start() {
    that.questionnaire.update({
      'view': 'questions'
    });
  }

  function skipQuestion() {
    if (state.currentQuestion + 1 < that.questionnaire.questionnaireJson.questions.length) {
      that.questionnaire.questions[state.currentQuestion].resetQuestion();
      that.questionnaire.nextQuestion();
    } else {

      // Is last question
      results();
    }
  }

  function checkQuestion() {
    that.questionnaire.questions[state.currentQuestion].answer();
  }

  function results() {
    that.questionnaire.update({
      'view': 'results',
      'progress': 100
    });
  }

  function resetQuestionnaire() {
    that.questionnaire.resetQuestionnaire();
  }

  var buttonsLeft  = [],
      buttonsRight = [];

  // Controls for intro
  if (state.view === 'intro') {

    buttonsRight.push(
      h('button.btn.btn-primary', {
        onclick: start,
      }, t('Start'))
    );

  }

  // Controls for questions
  if (state.view === 'questions') {

    // If not first question
    if (state.currentQuestion > 0) {

      buttonsLeft.push(
        h('button.btn.btn-primary-outline', {
          onclick: this.questionnaire.previousQuestion.bind(this.questionnaire)
        }, t('Back'))
      );

    }

    // Question view
    if (this.questionnaire.questions[state.currentQuestion].state.view === 'question') {

      buttonsRight.push(
        h('button.btn.btn-secondary', {
          onclick: skipQuestion
        }, t('Skip'))
      );

      if (this.questionnaire.questions[state.currentQuestion].state.validAnswer) {
        buttonsRight.push(
          h('button.btn.btn-primary', {
            onclick: checkQuestion
          }, t('Check answer'))
        );
      }

    }

    // Question result view
    if (this.questionnaire.questions[state.currentQuestion].state.view === 'result') {

      // If not last question
      if (state.currentQuestion + 1 < this.questionnaire.questionnaireJson.questions.length) {

        buttonsRight.push(
          h('button.btn.btn-primary', {
            onclick: this.questionnaire.nextQuestion.bind(this.questionnaire)
          }, t('Next'))
        );

      } else {

        buttonsRight.push(
          h('button.btn.btn-primary', {
            onclick: results
          }, t('View results'))
        );

      }

    }

  }

  // Controls for results
  if (state.view === 'results') {

    buttonsLeft.push(
      h('button.btn.btn-primary-outline', {
        onclick: resetQuestionnaire,
      }, t('Start over'))
    );

  }

  // Rendering
  var html = [
    h('div.row',
      h('div.col-sm-12',
        h('hr')
      )
    ),
    h('div.bpmn-questionnaire-controls.row',
      h('div.col-sm-12', [
        h('div.bpmn-questionnaire-controls-left.btn-group.pull-left', buttonsLeft),
        h('div.bpmn-questionnaire-controls-right.btn-group.pull-right', buttonsRight)
      ])
    )
  ];

  return html;
};

module.exports = Controls;
