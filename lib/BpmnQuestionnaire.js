'use strict';

var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

function BpmnQuestionnaire(options) {

  // Force options to be an object
  this.options = options || {};

  // Check if container was specified
  if (this.options.container) {
    this.container = this.options.container; 
  } else {

    // Report error
    console.log('Error: No container specified');
  }

  if (typeof this.options.container === 'string') { // ID?

    // Search for element with given ID
    var container = document.getElementById(this.options.container);
    //container.appendChild(h1);
  } else if (this.options.container.appendChild){ // Element?

    // Append questionnaire
    // this.options.container.appendChild(h1);
  }

  if (this.options.json) {
    this.json = this.options.json;
  } else {

    // Report error
    console.log('Error: No JSON specified');
  }
}

module.exports = BpmnQuestionnaire;