'use strict';

// virtual-dom
var h                 = require('virtual-dom/h');

// lodash
var difference        = require('lodash/difference'),
    join              = require('lodash/join');

// bpmn-questionnaire
var BpmnQuestionnaire = require('../../../../lib/BpmnQuestionnaire');

var multiple = BpmnQuestionnaire.createType({
  renderQuestion: function() {
    var that = this;
    var buttons = [];
    this.options.answers.forEach(function(answer) {

      console.log(that.state);

      buttons.push(
        h('button', {
          className: 'btn btn-block' + (that.state.selected.indexOf(answer) !== -1 ? ' btn-success' : ''), 
          onclick: function() {
            
            // Clone array
            var selected = that.state.selected.slice(0);

            if(that.state.selected.indexOf(answer) !== -1) {
              selected = selected.splice(that.state.selected.indexOf(answer), 1);
            } else {
              selected.push(answer);
            }
            
            // Push updates
            that.update({
              selected: selected
            });
          },
          style: {
            marginTop:    '5px',
            marginBottom: '5px'
          }
        }, answer)
      );
    });

    var html = 
      h('div', [
        h('p', this.options.text),
        this.diagram ? this.diagram.render(this.state) : h('div'),
        h('div', {
          style: {
            marginTop: '20px'
          }
        }, buttons)
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
      html =
        h('div.panel.panel-danger', [
            h('div.panel-heading',
              h('h3.panel-title', 'Oh nein!')
            ),
            h('div.panel-body', 'Ihre Antwort war leider falsch! Die richtigen Antworten lauten: ' + join(this.options.rightAnswers, ', '))
        ]);
    }

    return html;
  },
  checkIfValidAnswer: function() {
    return this.state.selected.length > 0;
  },
  checkIfRightAnswer: function() {
    return difference(this.options.rightAnswers, this.state.selected).length < 1;
  },
  addToState: {
    selected: []
  }
});

module.exports = multiple;