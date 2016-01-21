'use strict';

var h        = require('virtual-dom/h');

// Components
var Controls = require('./Controls.js');

function Intro(questionnaire) {
  this.questionnaire = questionnaire;
}

Intro.prototype.render = function(state) {
  // console.log('Rendering Intro with state:', state);

  // Rendering
  var html = [
    h('div.bpmn-questionnaire-intro.bpmn-questionnaire-row', [
      h('h2', this.questionnaire.questionnaireJson.name),
      h('p', this.questionnaire.questionnaireJson.intro),  
    ]),
    new Controls(this.questionnaire).render(state)
  ]

  return html;
};

module.exports = Intro;