'use strict';

var h        = require('virtual-dom/h');

// Components
var Progress = require('./Progress.js'),
    Controls = require('./Controls.js');

function Results(questionnaire) {
  this.questionnaire = questionnaire;
}

Results.prototype.render = function(state) {
  // console.log('Rendering Results with state:', state);

  // Rendering
  var html = [
    Progress.render(state),
    h('div.bpmn-questionnaire-results.bpmn-questionnaire-u-5-5', [
      h('h2', 'Ergebnisse')
    ]),
    new Controls(this.questionnaire).render(state)
  ];

  return html;
};

module.exports = Results;