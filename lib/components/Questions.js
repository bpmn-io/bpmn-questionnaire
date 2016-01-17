'use strict';

var h               = require('virtual-dom/h');

// Components
var Progress        = require('./Progress.js'),
    Controls        = require('./Controls.js'),
    Diagram         = require('./Diagram.js');

function Questions(questionnaire) {
  this.questionnaire = questionnaire;
}

Questions.prototype.render = function(state) {
  console.log('Rendering Questions with state:', state);

  // Rendering
  var html = [
    new Progress(this.questionnaire).render(state),
    h('div.bpmn-questionnaire-row', [
      h('h4', 'Frage ' + (state.currentQuestion + 1) + ' von ' + this.questionnaire.questionnaireJson.questions.length),
      h('p', this.questionnaire.questionnaireJson.questions[state.currentQuestion].text)
    ]),
    new Controls(this.questionnaire).render(state)
  ];

  return html;
};

module.exports = Questions;