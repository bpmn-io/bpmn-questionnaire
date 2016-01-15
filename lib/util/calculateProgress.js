'use strict';

/**
 * Calculate progress given a current value and a maximum value.
 * Returns a value between 0 and 100.
 *
 * @param {Number} currentValue - Current value.
 * @param {Number} maxValue - Maximum value.
 */
function calculateProgress(currentValue, maxValue) {
  return Math.ceil(currentValue / maxValue * 100);
}

module.exports = calculateProgress;