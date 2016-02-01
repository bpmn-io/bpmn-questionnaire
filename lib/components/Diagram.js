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

  this.element = createElement(h('div', {
    style: {
      'width': '100%'
    }
  }));
  
  this.viewer = new BpmnViewer({
    container: this.element
  });

  var that = this;

  if (options.xml) {
    
    // Load XML
    that.viewer.importXML(xhr.responseText, function(err) {

      if (!err) {
        console.log('success!');
        that.viewer.get('canvas').zoom('fit-viewport');
      } else {
        console.log('something went wrong:', err);
      }

    });

  } else if (options.url) {

    // Load XML via AJAX
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {

        console.log(xhr.responseText);

        that.viewer.importXML(xhr.responseText, function(err) {

          if (!err) {
            console.log('success!');
            that.viewer.get('canvas').zoom('fit-viewport');
          } else {
            console.log('something went wrong:', err);
          }

        });

      }
    };
    
    xhr.open("GET", options.url, true);
    xhr.send();

  } else {
    throw new Error('Unable to load diagram, no resource specified');
  }

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