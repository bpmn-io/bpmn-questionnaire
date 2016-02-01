'use strict';

var h = require('virtual-dom/h');

/**
 * Progress component.
 *
 * @constructor
 */
function Progress() {
}

/**
 * Rendering function of component.
 *
 * @param {Object} state - State of questionnaire.
 * @returns {Object} html - Virtual DOM tree of component.
 */
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