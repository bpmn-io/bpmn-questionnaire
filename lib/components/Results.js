'use strict';

var h        = require('virtual-dom/h');

// Components
var Progress = require('./Progress.js');

function Results(questionnaire) {
  this.questionnaire = questionnaire;
}

Results.prototype.render = function(state) {
  console.log('Rendering Results with state:', state);

  var that = this;

  // Handler functions
  function resetQuestionnaire() {
    that.questionnaire.resetQuestionnaire();
  }

  // Rendering
  var html = [
    new Progress(this.questionnaire).render(state),
    h('div.bpmn-questionnaire-results.bpmn-questionnaire-u-5-5', [
      h('h1', 'Ergebnisse'),
      h('button.bpmn-questionnaire-button.bpmn-questionnaire-button-primary', {
        onclick: resetQuestionnaire,
      }, 'Von vorn beginnen')
    ])
  ];

  return html;
};

module.exports = Results;