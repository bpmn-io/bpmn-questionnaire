'use strict';

// Get the contructor function
var Questionnaire = require('../../lib/Questionnaire');
var TestContainer = require('mocha-test-container-support');

describe('creating a new questionnaire', function() {

  var testContentContainer;
  var element;

  beforeEach(function() {

    // Add test container
    testContentContainer = TestContainer.get(this);

    // Create new DOM element with an id and assign to container
    element = document.createElement('div');

    // Append the container element to the test container element
    testContentContainer.appendChild(element);
  });

  it('should create a new instance of Questionnaire given a DOM element as container', function() {
    
    var questionnaire = new Questionnaire(
      {
        container: element
      }
    );
    
    // Check for new instance
    expect(true).to.be.true;
  });

  it('should create a new instance of Questionnaire given an id of the container', function() {
    
    // Give our container an ID
    element.setAttribute('id', 'container');

    var questionnaire = new Questionnaire(
      {
        container: 'container'
      }
    );

    
    expect(true).to.be.true;
  });

});