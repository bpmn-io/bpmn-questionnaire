'use strict';

var AppendHook = function(element) {
  this.element = element;
};

AppendHook.prototype.hook = function hook(node) {

  node.appendChild(this.element);

};

module.exports = AppendHook;