'use strict';

var h = require('virtual-dom/h');

function Progress(questionnaire) {
  this.questionnaire = questionnaire;
}

Progress.render = function(state) {
  
  // Rendering
  var html =
    h('div.bpmn-questionnaire-row',
      h('div.bpmn-questionnaire-col-md-12',
        h('progress', {
          className: 'bpmn-questionnaire-progress' + (state.progress === 100 ? ' bpmn-questionnaire-progress-success' : ''),
          value: state.progress,
          max: 100
        })
      )
    );

  return html;
};

module.exports = Progress;