'use strict';

// lodash
var isString = require('lodash/isString');

/**
 * A pluggable translator.
 *
 * @constructor
 * @param {Function} plugin - A function that translates a given key.
 */
function Translator(plugin) {
  this.plugin = plugin;
}

/**
 * Returns a key that has been translated by a plugin or just the key itself if no plugin is provided.
 *
 * @param {String} key - Key that is going to be translated.
 */
Translator.prototype.translate = function(key) {

  if(isString(key)) {

    // Use plugin for translation if provided
    return (this.plugin ? this.plugin(key) : key);

  } else {
    throw new Error('Parameter must be a string');
  }

}

module.exports = Translator;
