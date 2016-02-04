'use strict';

var h        = require('virtual-dom/h');

// Components
var Progress = require('./Progress.js'),
    Controls = require('./Controls.js');

/**
 * Results component.
 *
 * @constructor
 * @param {Object} questionnaire - Reference to questionnaire.
 */
function Results(questionnaire) {
  this.questionnaire = questionnaire;
}

/**
 * Rendering function of component.
 *
 * @param {Object} state - State of questionnaire.
 * @returns {Object} html - Virtual DOM tree of component.
 */
Results.prototype.render = function(state) {

  var that = this;

  var rightAnswers = 0;

  this.questionnaire.questions.forEach(function(question, index) {
    if (question.state.rightAnswer) {
      rightAnswers++;
    }
  });

  var content;

  if ((rightAnswers / this.questionnaire.questions.length) > 0.5) {
    content = 
      h('div.panel.panel-success', [
          h('div.panel-heading',
            h('h3.panel-title', 'Glückwunsch!')
          ),
          h('div.panel-body', 'Sie haben ' + rightAnswers + ' Fragen von ' + this.questionnaire.questions.length + ' richtig beantwortet!')
      ]);
  } else {
    content =
      h('div.panel.panel-danger', [
          h('div.panel-heading',
            h('h3.panel-title', 'Oh nein!')
          ),
          h('div.panel-body', 'Sie haben nur ' + rightAnswers + ' Fragen von ' + this.questionnaire.questions.length + ' richtig beantwortet! Versuchen Sie es doch einfach noch einmal!')
      ]);

  }

  // Rendering
  var html = 
    h('div.bpmn-questionnaire-results.row',
      h('div.col-md-12', [
        h('h2', {style: {'margin-bottom': '20px'}}, 'Ergebnis'),
        content
      ])
    );

  return html;
};

module.exports = Results;