'use strict';

var h = require('virtual-dom/h');

function Controls(questionnaire) {
  this.questionnaire = questionnaire;
}

Controls.prototype.render = function(state) {
  console.log('Rendering Controls with state:', state);
  console.log('Current question: ' + state.currentQuestion);
  console.log('Number of questions: ' + this.questionnaire.questionnaireJson.questions.length);

  var that = this;

  // Handler functions
  function results() {
    that.questionnaire.update({
      'view': 'results',
      'progress': 100
    });
  }

  // Rendering
  var html =
    h('div.bpmn-questionnaire-controls.bpmn-questionnaire-u-5-5', [
      h('button.bpmn-questionnaire-button.bpmn-questionnaire-button-primary', {
        onclick: this.questionnaire.previousQuestion.bind(this.questionnaire),
        style: {
          'display': state.currentQuestion < 1 ? 'none' : 'inline-block'
        }
      }, 'Zurück'),
      h('button.bpmn-questionnaire-button.bpmn-questionnaire-button-primary.bpmn-questionnaire-float-right', {
        onclick: this.questionnaire.nextQuestion.bind(this.questionnaire),
        style: {
          'display': state.currentQuestion + 1 === this.questionnaire.questionnaireJson.questions.length ? 'none' : 'inline-block' 
        }
      }, 'Weiter'),
      h('button.bpmn-questionnaire-button.bpmn-questionnaire-button-primary.bpmn-questionnaire-float-right', {
        onclick: results,
        style: {
          'display': state.currentQuestion + 1 === this.questionnaire.questionnaireJson.questions.length ? 'inline-block' : 'none' 
        }
      }, 'Ergebnisse ansehen')
    ]);

  return html;
};

module.exports = Controls;