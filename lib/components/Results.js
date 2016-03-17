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

  // Get translator service
  var t = this.questionnaire.get('translator');

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
            h('h3.panel-title', t('Congratulations'))
          ),
          h('div.panel-body',
            t('You answered ') +
            rightAnswers +
            t(' questions of total ') +
            this.questionnaire.questions.length +
            ' right!')
      ]);
  } else {
    content =
      h('div.panel.panel-danger', [
          h('div.panel-heading',
            h('h3.panel-title', t('Oh no!'))
          ),
          h('div.panel-body',
            t('You only answered ') +
            rightAnswers +
            t(' questions of total ') +
            this.questionnaire.questions.length +
            t(' right!'))
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
