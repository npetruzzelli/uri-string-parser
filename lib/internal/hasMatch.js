'use strict'

/**
 *
 * @param {*} matchResult - the result `String.prototype.match()`.
 * @returns {Boolean} - Whether or not a result contained matches.
 */
function hasMatch(matchResult) {
  if (matchResult === null) {
    return false
  }
  return matchResult && matchResult.length > 0
}

module.exports = hasMatch
