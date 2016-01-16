'use strict';

var h = require('virtual-dom/h');

function Progress(questionnaire) {
  this.questionnaire = questionnaire;
}

Progress.prototype.render = function(state) {
  console.log('Rendering Progress with state:', state);
  
  // Rendering
  var html =
    h('div.bpmn-questionnaire-progress',
      h('progress', {
        className: 'bpmn-questionnaire-progress' + (state.progress === 100 ? ' bpmn-questionnaire-progress-success' : ''),
        value: state.progress,
        max: 100
      })
    );

  return html;
};

module.exports = Progress;