'use strict';

var h      = require('virtual-dom/h');

// lodash
var assign = require('lodash/assign');

function Controls(questionnaire) {
  this.questionnaire = questionnaire;
}

Controls.prototype.render = function(state) {
  // console.log('Rendering Controls with state:', state);
  // console.log('Current question: ' + state.currentQuestion);
  // console.log('Number of questions: ' + this.questionnaire.questionnaireJson.questions.length);

  var that = this;

  // Handler functions
  function start() {
    that.questionnaire.update({
      'view': 'questions'
    });
  }

  function results() {
    that.questionnaire.update({
      'view': 'results',
      'progress': 100
    });
  }

  function resetQuestionnaire() {
    assign({}, that.questionnaire.resetQuestionnaire());
  }

  var buttonsLeft  = [],
      buttonsRight = [];

  if (state.view === 'intro') {

    buttonsRight.push(
      h('button.bpmn-questionnaire-button', {
        onclick: start,
      }, 'Start')
    );

  }

  // Controls for questions
  if (state.view === 'questions') {

    // If not first question
    if (state.currentQuestion > 0) {
      
      buttonsLeft.push(
        h('button.bpmn-questionnaire-button', {
          onclick: this.questionnaire.previousQuestion.bind(this.questionnaire)
        }, 'Zurück')
      );

    }

    // If not last question
    if (state.currentQuestion + 1 < this.questionnaire.questionnaireJson.questions.length) {
      
      buttonsRight.push(
        h('button.bpmn-questionnaire-button.bpmn-questionnaire-secondary', {
          onclick: this.questionnaire.nextQuestion.bind(this.questionnaire)
        }, 'Überspringen')
      );

      buttonsRight.push(
        h('button.bpmn-questionnaire-button', {
          onclick: this.questionnaire.nextQuestion.bind(this.questionnaire)
        }, 'Weiter')
      );

    } else {

      buttonsRight.push(
        h('button.bpmn-questionnaire-button', {
          onclick: results
        }, 'Ergebnisse ansehen')
      );

    }

  }

  if (state.view === 'results') {

    buttonsLeft.push(
      h('button.bpmn-questionnaire-button.bpmn-questionnaire-button-primary', {
        onclick: resetQuestionnaire,
      }, 'Von vorn beginnen')
    );

  }

  // Rendering
  var html =
    h('div.bpmn-questionnaire-controls.bpmn-questionnaire-row', [
      h('div.bpmn-questionnaire-controls-left.bpmn-questionnaire-button-group', buttonsLeft),
      h('div.bpmn-questionnaire-controls-right.bpmn-questionnaire-button-group', buttonsRight)
    ]);

  return html;
};

module.exports = Controls;