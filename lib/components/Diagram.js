'use strict';

var h          = require('virtual-dom/h'),
    BpmnViewer = require('bpmn-js');

/**
 * Diagram component
 */
function Diagram(questionnaire) {
  this.questionnaire = questionnaire;
}

Diagram.prototype.render = function(state) {
  console.log('Rendering Diagram with state:', state);

  var html = 
    h('h1', 'Placeholder for an actual diagram');

  return html;
};

module.exports = Diagram;