'use strict';

var TestHelper = module.exports = require('bpmn-js/test/helper');

// Insert bpmn-questionnaire styles
TestHelper.insertCSS('bpmn-questionnaire.css', require('../assets/css/bpmn-questionnaire.css'));

// Insert additional styles for test container
TestHelper.insertCSS('bpmn-questionnaire-testing.css', require('../assets/css/bpmn-questionnaire-testing.css'));