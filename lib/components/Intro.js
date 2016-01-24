'use strict';

// virtual-dom
var h = require('virtual-dom/h');

function Intro(questionnaire) {
  this.questionnaire = questionnaire;
}

Intro.prototype.render = function(state) {

  // Rendering
  var html =
    h('div.bpmn-questionnaire-intro.bpmn-questionnaire-row', 
      h('div.bpmn-questionnaire-col-md-12', [
        h('h2', this.questionnaire.questionnaireJson.name),
        h('p', this.questionnaire.questionnaireJson.intro)  
      ])
    );

  return html;
};

module.exports = Intro;