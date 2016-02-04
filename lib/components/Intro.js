'use strict';

// virtual-dom
var h = require('virtual-dom/h');

/**
 * Intro component.
 *
 * @constructor
 * @param {Object} questionnaire - Reference to questionnaire.
 */
function Intro(questionnaire) {
  this.questionnaire = questionnaire;
}

/**
 * Rendering function of component.
 *
 * @param {Object} state - State of questionnaire.
 * @returns {Object} html - Virtual DOM tree of component.
 */
Intro.prototype.render = function(state) {

  // Rendering
  var html =
    h('div.bpmn-questionnaire-intro.row', 
      h('div.col-sm-12', [
        h('h2', this.questionnaire.questionnaireJson.name),
        h('p', this.questionnaire.questionnaireJson.intro)  
      ])
    );

  return html;
};

module.exports = Intro;