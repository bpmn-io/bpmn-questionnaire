'use strict';

var h = require('virtual-dom/h');

function Progress(questionnaire) {
  this.questionnaire = questionnaire;
}

Progress.prototype.render = function(state) {
  // console.log('Rendering Progress with state:', state);
  
  // Rendering
  var html =
    h('div.bpmn-questionnaire-row',
      h('div', {
        'className':     'bpmn-questionnaire-progress' + (state.progress === 100 ? ' bpmn-questionnaire-success' : ''),
        'role':          'progressbar',
        'aria-valuenow': state.progress,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'style': {
          'width': '100%'
        }
      },
        h('div.bpmn-questionnaire-progress-meter', {
          style: {
            'width': state.progress + '%'
          }
        })
      )
    );

  return html;
};

module.exports = Progress;