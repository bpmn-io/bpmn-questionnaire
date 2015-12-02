'use strict';

// Get the contructor function
var Questionnaire = require('../../lib/Questionnaire');

describe('test', function() {

	it('should say hello', function() {
		var q = new Questionnaire();
		var res = q.sayHello();
		expect(res).to.equal('Hello');
	});

});