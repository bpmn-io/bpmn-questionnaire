'use strict';

// lodash
var has = require('lodash/has');

// An example plugin that can be used with the translation service
var translation = (function() {

  var language,
      resources = {};

  function setLanguage(l) {
    language = l;
  }

  function addLanguage(l, r) {
    resources[l] = r;
  }

  function t(key) {

    if (has(resources, language + '.' + key)) {
      return resources[language][key];
    } else {

      // Fail silently
      return key;
    }
  }

  return {
    setLanguage: setLanguage,
    addLanguage: addLanguage,
    t:           t
  };
}());

module.exports = translation;
