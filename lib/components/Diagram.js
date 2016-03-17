'use strict';

// virtual-dom
var h             = require('virtual-dom/h'),
    createElement = require("virtual-dom/create-element");

// seamless-immutable
var Immutable     = require('seamless-immutable');

// lodash
var assign        = require('lodash/assign'),
    clone         = require('lodash/clone'),
    has           = require('lodash/has');

// Hooks
var AppendHook    = require('../hooks/AppendHook.js');

/**
 * Diagram component.
 *
 * @param {number} index - Index of question.
 * @param {Object} options - Options.
 * @param {Object} question - Reference to the Question instance.
 */
function Diagram(index, options, question) {

  this.index    = index;
  this.options  = options;
  this.question = question;

  this.element = createElement(h('li.list-group-item', {
    style: {
      width: '100%',
      height: '500px'
    }
  }));

  this.viewer;

  if (options.xml) {

    // Load XML
    this.xml = options.xml;

  } else if (options.url) {

    var that = this;

    // Load XML via AJAX
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {

        that.xml = xhr.responseText;

      }
    };

    xhr.open("GET", options.url, true);
    xhr.send();

  } else {
    throw new Error('Unable to load diagram, no resource specified');
  }

  this.initState = Immutable({
    selected: []
  });

  this.state = this.initState.asMutable({deep: true});

}

Diagram.prototype.render = function(state) {

  if(state.view === 'result') {

    // Get overlays service
    var overlays = this.viewer.get('overlays');
    var elementRegistry = this.viewer.get('elementRegistry');

    // Remove all overlays
    overlays.remove({
      type: 'test'
    });

    // Add overlays to right elements
    this.options.rightAnswers.forEach(function(answer) {
      var element = elementRegistry.get(answer);

      var dim = element.width > element.height ? element.width : element.height;
      dim = dim + (dim / 2.5);

      var html = createElement(h('div', {
        style: {
          width: dim + 'px',
          height: dim + 'px',
          backgroundColor: 'rgba(92, 184, 92, 0.5)',
          borderRadius: "100%"
        }
      }));

      overlays.add(element, 'result', {
        position: {
          top:  0 - ((dim - element.height) / 2),
          left: 0 - ((dim - element.width) / 2)
        },
        html: html
      });

    });

  }

  var html =
    h('ul.list-group',  {
      "onAppend": new AppendHook(this),
      key: "diagram-" + this.index,
      style: {
        width: '100%',
        height: '500px'
      }
    });

  return html;
};

Diagram.prototype.update = function(options, equal) {

  // Always clone to prevent mutation
  options = clone(options);

  if(equal) {

    // Set state equal to options
    this.state = options;
  } else {

    // Update state
    assign(this.state, options);
  }

  // Kick of update method off question to check for valid answer
  this.question.update({});
}

Diagram.prototype.resetDiagram = function() {

  if (this.element.children.length) {
    this.viewer.destroy();
  }

};

Diagram.prototype.addInteraction = function() {

  var that = this;

  var eventBus = this.viewer.get('eventBus');
  var overlays = this.viewer.get('overlays');

  var overlaysIds = [];

  // Overwrite defaults https://github.com/bpmn-io/diagram-js/blob/master/lib/features/overlays/Overlays.js to make overlays visible at any zoom
  overlays._overlayDefaults = {
    show: {
      minZoom: 0.1,
      maxZoom: 100
    }
  };

  eventBus.on('element.click', function(e) {

    var select = true;

    if (that.options.noSelect) {

      // Can element be selected?
      if (that.options.noSelect.elements) {
        if (that.options.noSelect.elements.indexOf(e.element.id) !== -1) {
          select = false;
        }
      }

      // Can type be selected?
      if (that.options.noSelect.types) {
        that.options.noSelect.types.forEach(function(type) {
          if(e.element.type.toLowerCase().includes(type.toLowerCase())) {
            select = false;
          }
        });
      }

    }

    var id;

    if (select) {

      if (that.state.selected.indexOf(e.element.id) === -1) {

        if (has(that.options, 'singleSelect')) {

          // Check if multiple elements can be selected
          if (that.options.singleSelect === true) {

            // Remove all overlays
            overlaysIds.forEach(function(overlay) {
              overlays.remove(overlay);
            });
            overlaysIds = [];

            that.update({
              selected: [e.element.id]
            });
          } else {

            // Clone array
            var selected = that.state.selected.slice(0);
            selected.push(e.element.id);

            that.update({
              selected: selected
            });
          }

        } else {

          // Clone array
          var selected = that.state.selected.slice(0);
          selected.push(e.element.id);

          that.update({
            selected: selected
          });
        }

      }

      var dim = e.element.width > e.element.height ? e.element.width : e.element.height;
      dim = dim + (dim / 2.5);

      var html = createElement(h('div', {
        style: {
          width: dim + 'px',
          height: dim + 'px',
          backgroundColor: 'rgba(51, 122, 183, 0.5)',
          borderRadius: "100%"
        },
        onclick: function() {
          console.info('Removing ' + id);
          overlays.remove(id);

          // Clone array
          var selected = that.state.selected.slice(0);
          selected.splice(that.state.selected.indexOf(e.element.id), 1);

          that.update({
            selected: selected
          });

        }
      }));

      id = overlays.add(e.element, 'test', {
        position: {
          top:  0 - ((dim - e.element.height) / 2),
          left: 0 - ((dim - e.element.width) / 2)
        },
        html: html
      });

      overlaysIds.push(id);

    }

  });
};

module.exports = Diagram;
