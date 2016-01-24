'use strict';

var h        = require('virtual-dom/h');

// Components
var Progress = require('./Progress.js'),
    Controls = require('./Controls.js');

function Results(questionnaire) {
  this.questionnaire = questionnaire;
}

Results.prototype.render = function(state) {

  var that = this;

  var rightAnswers = 0;

  this.questionnaire.questions.forEach(function(question, index) {
    if (question.state.rightAnswer) {
      rightAnswers++;
    }
  });

  var card;

  if ((rightAnswers / this.questionnaire.questions.length) > 0.5) {
    card = 
      h('div.bpmn-questionnaire-card.bpmn-questionnaire-card-inverse.bpmn-questionnaire-card-success.bpmn-questionnaire-text-xs-center',
        h('div.bpmn-questionnaire-card-block', [
          h('h2', {style: {'color': '#fff'}}, 'Glückwunsch!'),
          h('p', {style: {'color': '#fff'}}, 'Sie haben ' + rightAnswers + ' Fragen von ' + this.questionnaire.questions.length + ' richtig beantwortet!')
        ])
      );
  } else {
    card =
      h('div.bpmn-questionnaire-card.bpmn-questionnaire-card-inverse.bpmn-questionnaire-card-danger.bpmn-questionnaire-text-xs-center',
        h('div.bpmn-questionnaire-card-block', [
          h('h2', {style: {'color': '#fff'}}, 'Oh nein!'),
          h('p', {style: {'color': '#fff'}}, 'Sie haben nur ' + rightAnswers + ' Fragen von ' + this.questionnaire.questions.length + ' richtig beantwortet! Versuchen Sie es doch einfach noch einmal!')
        ])
      );
  }

  // Rendering
  var html = 
    h('div.bpmn-questionnaire-results.bpmn-questionnaire-row',
      h('div.bpmn-questionnaire-col-md-12', [
        h('h2', {style: {'margin-bottom': '20px'}}, 'Ergebnis'),
        card
      ])
    );

  return html;
};

module.exports = Results;