'use strict';

// virtual-dom
var h             = require('virtual-dom/h'),
    createElement = require("virtual-dom/create-element");

// bpmn-js
var BpmnViewer    = require('bpmn-js');

// lodash
var cloneDeep     = require('lodash/cloneDeep');

// Hooks
var AppendHook    = require('../hooks/AppendHook.js');

/**
 * Diagram component
 */
function Diagram(index, options, question) {

  this.index    = index;
  this.options  = options;
  this.question = question;

  this.element = createElement(h('div'));
  
  this.viewer = new BpmnViewer({
    container: this.element
  });

  console.log(this.options.xml);

  this.viewer.importXML(this.options.xml, function(err) {

    if (!err) {
      viewer.get('canvas').zoom('fit-viewport');
    } else {
      throw new Error('Failed to load XML');
    }
    
  });

  this.initState = {
    selected: []
  }

  this.state = cloneDeep(this.initState);

}

Diagram.prototype.render = function(state) {

  var html = 
    h('div',  {
      "onAppend": new AppendHook(this.element),
      key: "diagram-" + this.index
    });

  return html;
};

Diagram.prototype.resetDiagram = function() {

}

module.exports = Diagram;