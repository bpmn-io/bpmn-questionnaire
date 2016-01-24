'use strict';

var h      = require('virtual-dom/h');

// lodash
var assign = require('lodash/assign');

function Controls(questionnaire) {
  this.questionnaire = questionnaire;
}

Controls.prototype.render = function(state) {

  var that = this;

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
      h('button.bpmn-questionnaire-btn.bpmn-questionnaire-btn-primary', {
        onclick: start,
      }, 'Start')
    );

  }

  // Controls for questions
  if (state.view === 'questions') {

    // If not first question
    if (state.currentQuestion > 0) {
      
      buttonsLeft.push(
        h('button.bpmn-questionnaire-btn.bpmn-questionnaire-btn-primary-outline', {
          onclick: this.questionnaire.previousQuestion.bind(this.questionnaire)
        }, 'Zurück')
      );

    }

    // Question view
    if (this.questionnaire.questions[state.currentQuestion].state.view === 'question') {

      buttonsRight.push(
        h('button.bpmn-questionnaire-btn.bpmn-questionnaire-btn-secondary', {
          onclick: skipQuestion
        }, 'Überspringen')
      );

      if (this.questionnaire.questions[state.currentQuestion].state.validAnswer) {
        buttonsRight.push(
          h('button.bpmn-questionnaire-btn.bpmn-questionnaire-btn-primary', {
            onclick: checkQuestion
          }, 'Antwort prüfen')
        );
      }

    }

    // Question result view
    if (this.questionnaire.questions[state.currentQuestion].state.view === 'result') {
      
      // If not last question
      if (state.currentQuestion + 1 < this.questionnaire.questionnaireJson.questions.length) {

        buttonsRight.push(
          h('button.bpmn-questionnaire-btn.bpmn-questionnaire-btn-primary', {
            onclick: this.questionnaire.nextQuestion.bind(this.questionnaire)
          }, 'Weiter')
        );

      } else {

        buttonsRight.push(
          h('button.bpmn-questionnaire-btn.bpmn-questionnaire-btn-primary', {
            onclick: results
          }, 'Ergebnisse ansehen')
        );

      }

    }

  }

  // Controls for results
  if (state.view === 'results') {

    buttonsLeft.push(
      h('button.bpmn-questionnaire-btn.bpmn-questionnaire-btn-primary-outline', {
        onclick: resetQuestionnaire,
      }, 'Von vorn beginnen')
    );

  }

  // Rendering
  var html =
    h('div.bpmn-questionnaire-controls.bpmn-questionnaire-row',
      h('div.bpmn-questionnaire-col-md-12', [
        h('div.bpmn-questionnaire-controls-left.bpmn-questionnaire-btn-group.bpmn-questionnaire-pull-sm-left', buttonsLeft),
        h('div.bpmn-questionnaire-controls-right.bpmn-questionnaire-btn-group.bpmn-questionnaire-pull-sm-right', buttonsRight)
      ])
    );

  return html;
};

module.exports = Controls;