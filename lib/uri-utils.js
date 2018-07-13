'use strict'
var Utils = {}

/**
 * Determine if the result of String.prototype.match() contains matches or not.
 *
 * @memberof Utils
 * @static
 * @param {Array|null}  stringMatchResult
 * @return {Boolean}
 */
Utils.hasMatch = function hasMatch(stringMatchResult) {
  return stringMatchResult === null ? false : Array.isArray(stringMatchResult)
}

/**
 * Modeled after the lodash.isObjectLike method.
 */
Utils.isObjectLike = function isObjectLike(possibleObject) {
  return possibleObject != null && typeof possibleObject == 'object' // eslint-disable-line eqeqeq
}

/**
 * Modeled after the lodash.isString method.
 * @param {*} possibleString
 */
Utils.isString = function isString(possibleString) {
  var stringTag = '[object String]'
  var possibleStringTag = Object.prototype.toString.call(possibleString)
  return (
    typeof possibleString === 'string' ||
    (!Array.isArray(possibleString) &&
      Utils.isObjectLike(possibleString) &&
      possibleStringTag === stringTag)
  )
}

Utils.unmatchedAsNull = function unmatchedAsNull(matches) {
  if (!Array.isArray(matches)) {
    return matches
  }
  function mapUndefinedToNull(match) {
    return typeof match === 'undefined' ? null : match
  }
  return matches.map(mapUndefinedToNull)
}

module.exports = Utils
