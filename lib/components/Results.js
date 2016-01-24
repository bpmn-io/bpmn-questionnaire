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
  var html = 
    h('div.bpmn-questionnaire-results.bpmn-questionnaire-row',
      h('div.bpmn-questionnaire-col-md-12', [
        h('h2', 'Ergebnisse')
      ])
    );

  return html;
};

module.exports = Results;