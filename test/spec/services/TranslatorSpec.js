'use strict';

// Get the helper function
var Translator = require('../../../lib/services/Translator');

// Sample plugin
var plugin     = require('../../fixtures/js/plugins/translation.js');

describe('Translator', function() {

  var translator,
      translatorWithPlugin;

  beforeEach(function() {
    translator = new Translator();

    plugin.setLanguage('de');
    plugin.addLanguage('de', {
      'Start':        'Beginnen',
      'Back':         'Zurück',
      'Skip':         'Überspringen',
      'Check answer': 'Antwort überprüfen',
      'Next':         'Weiter',
      'View results': 'Ergebnisse ansehen',
      'Start over':   'Von vorne beginnen'
    });
    translatorWithPlugin = new Translator(plugin.t);
  });

  it('should create an instance of Translator', function() {
    var t = new Translator();

    expect(t).to.exist;
  });

  it('should accept a plugin as input when creating a new instance', function() {
    var p = function() {};

    var t = new Translator(p);

    expect(t.plugin).to.equal(p);
  });

  it('should return the string if no plugin was provided', function() {
    var translation = translator.translate('Next');

    expect(translation).to.equal('Next');
  });

  it('should throw an error if the parameter is not a string', function() {
    var translate = translator.translate.bind(translator, 1);

    expect(translate).to.throw('Parameter must be a string');
  });

  it('should use the plugin for translation if provided', function() {
    var translation = translatorWithPlugin.translate('Next');

    expect(translation).to.equal('Weiter');
  });

});
