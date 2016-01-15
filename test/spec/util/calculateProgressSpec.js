'use strict';

// Get the helper function
var calculateProgress = require('../../../lib/util/calculateProgress');

describe('calculateProgress', function() {

  it('should calculate progress', function() {

    expect(calculateProgress(5, 10)).to.equal(50);

  });

});