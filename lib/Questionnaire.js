'use strict';

var h = require('virtual-dom/h');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

function Questionnaire(options) {
  
  var container;
  var h1 = document.createElement('h1');
  var t = document.createTextNode('Hello World');
  h1.appendChild(t);  

  // Force options to be an object
  this.options = options || {};

  if (this.options.container) {
    this.container = this.options.container; 
  } else {

    // Throw error
    console.log('Error: No container specified');
  }

  if (typeof this.options.container === 'string') { // ID?

    // Search for element with given ID
    container = document.getElementById(this.options.container);
    container.appendChild(h1);
  } else if (this.options.container.appendChild){ // Element?

    // Append questionnaire
    this.options.container.appendChild(h1);
  }
}

module.exports = Questionnaire;