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
    h('div.row',
      h('div.col-md-12',
        h('div.progress',
          h('div', {
            className: 'progress-bar' + (state.progress === 100 ? ' progress-bar-success' : ''),
            style: {
              width: state.progress + '%'
            }
          })
        )
      )
    );

  return html;
};

module.exports = Progress;