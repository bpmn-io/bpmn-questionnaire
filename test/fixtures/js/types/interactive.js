'use strict';

// virtual-dom
var h                 = require('virtual-dom/h');

// lodash
var difference        = require('lodash/difference');

// bpmn-questionnaire
var BpmnQuestionnaire = require('../../../../lib/BpmnQuestionnaire');

var interactive = BpmnQuestionnaire.createType({
  renderQuestion: function() {
    var html = 
      h('div', [
        h('p', this.options.text),
        this.diagram.render(this.state)
      ]);

    return html;
  },
  renderResult: function() {
    var html;

    if (this.state.rightAnswer) {
      html = 
        h('div.panel.panel-success', [
            h('div.panel-heading',
              h('h3.panel-title', 'Glückwunsch!')
            ),
            h('div.panel-body', 'Sie haben diese Frage richtig beantwortet!')
        ]);
    } else {
      html = [
        h('div.panel.panel-danger', [
            h('div.panel-heading',
              h('h3.panel-title', 'Oh nein!')
            ),
            h('div.panel-body', 'Ihre Antwort war leider falsch! Die richtige Antwort lautet:')
        ]),
        this.diagram.render(this.state)
      ]
    }

    return html;
  },
  checkIfValidAnswer: function() {
    return this.diagram.state.selected.length > 0;
  },
  checkIfRightAnswer: function() {
    return difference(this.options.diagram.rightAnswers, this.diagram.state.selected).length < 1;
  }
});

module.exports = interactive;