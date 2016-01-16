'use strict';

var h = require('virtual-dom/h');

function Intro(questionnaire) {
  this.questionnaire = questionnaire;
}

Intro.prototype.render = function(state) {
  console.log('Rendering Intro with state:', state);

  var that = this;

  // Handler functions
  function start() {
    that.questionnaire.update({
      'view': 'questions'
    });
  }

  // Rendering
  var html =
    h('div.bpmn-questionnaire-intro.bpmn-questionnaire-u-5-5', [
      h('h1', this.questionnaire.questionnaireJson.name),
      h('p', this.questionnaire.questionnaireJson.intro),
      h('button.bpmn-questionnaire-button.bpmn-questionnaire-button-primary.bpmn-questionnaire-float-right', {
        onclick: start,
      }, 'Start')
    ]);

  return html;
};

module.exports = Intro;