'use strict';

module.exports = function(karma) {
  karma.set({

    basePath: '../../',

    frameworks: [
      'browserify',
      'mocha',
      'chai'
    ],

    files: [
      'test/spec/**/*Spec.js'
    ],

    reporters: ['dots'],

    preprocessors: {
      'test/spec/**/*Spec.js': ['browserify']
    },

    browsers: ['Chrome'],

    browserNoActivityTimeout: 30000,

    singleRun: false,

    autoWatch: true,

    browserify: {
      debug: true,
      transform: [['stringify', {extensions: ['.bpmn', '.xml', '.css', '.json']}]]
    }
  });
};
