'use strict'
const Utils = require('./uri-utils')
const URIStringValidator = require('./uri-string-validator')

function URIObjectValidator() {}

/**
 * Determine if the value is similar to a URI Object by checking the types of
 * individual properties without validating them.
 *
 * @memberof URIObjectValidator
 * @alias    URIObjectValidator.isURILikeObject
 * @static
 * @param {*} possibleURILikeObject
 * @return {Boolean}
 */
function isURILikeObject(possibleURILikeObject) {
  var authority
  var fragment
  var path
  var query
  var scheme
  var slashes

  if (possibleURILikeObject == null) {
    return false
  }

  // SCHEME
  scheme = possibleURILikeObject.scheme
  if (!Utils.isString(scheme) && scheme !== null) {
    return false
  }

  // AUTHORITY & SLASHES
  slashes = possibleURILikeObject.slashes
  if (!Utils.isString(slashes) && slashes != null) {
    // Note the use of `!=` instead of `!==`. Slashes may be undefined, where
    // other properties usually must be null or a string.
    return false
  }
  authority = possibleURILikeObject.authority
  if (!Utils.isString(authority) && authority !== null) {
    return false
  }

  // PATH
  path = possibleURILikeObject.path
  if (!Utils.isString(path)) {
    return false
  }

  // QUERY
  query = possibleURILikeObject.query
  if (!Utils.isString(query) && query !== null) {
    return false
  }

  // FRAGMENT
  fragment = possibleURILikeObject.fragment
  if (!Utils.isString(fragment) && fragment !== null) {
    return false
  }

  return true
}
URIObjectValidator.isURILikeObject = isURILikeObject

/**
 * Determine if the value is a URI Object by validating individual properties.
 *
 * @memberof URIObjectValidator
 * @alias    URIObjectValidator.isURIObject
 * @static
 * @param {*} possibleURIObject
 * @return {Boolean}
 */
function isURIObject(possibleURIObject) {
  var isValidAuthority
  var isValidAuthorityString
  var isValidFragment
  var isValidPath
  var isValidQuery
  var isValidScheme
  var isValidSchemeString
  var isValidSlashes
  var path

  if (possibleURIObject == null) {
    return false
  }

  // SCHEME
  isValidSchemeString = URIStringValidator.isURIScheme(possibleURIObject.scheme)
  isValidScheme = isValidSchemeString || possibleURIObject.scheme === null

  // AUTHORITY & SLASHES
  isValidAuthorityString = URIStringValidator.isURIAuthority(
    possibleURIObject.authority
  )
  isValidAuthority =
    isValidAuthorityString || possibleURIObject.authority === null
  if (isValidAuthorityString) {
    // Slashes are optional for a well formed object, but if defined, it must
    // have a valid value.
    isValidSlashes =
      possibleURIObject.authority === '//' ||
      possibleURIObject.authority == null
  } else {
    isValidSlashes = possibleURIObject.authority == null
  }

  // PATH
  path = possibleURIObject.path
  if (isValidAuthorityString) {
    isValidPath = URIStringValidator.isURIPathAbempty(path)
  } else {
    if (!isValidSchemeString) {
      isValidPath =
        URIStringValidator.isURIPathAbsolute(path) ||
        URIStringValidator.isURIPathNoScheme(path) ||
        URIStringValidator.isURIPathEmpty(path)
    } else {
      isValidPath =
        URIStringValidator.isURIPathAbsolute(path) ||
        URIStringValidator.isURIPathRootless(path) ||
        URIStringValidator.isURIPathEmpty(path)
    }
  }

  // QUERY
  isValidQuery =
    URIStringValidator.isURIQuery(possibleURIObject.query) ||
    possibleURIObject.query === null

  // FRAGMENT
  isValidFragment =
    URIStringValidator.isURIFragment(possibleURIObject.fragment) ||
    possibleURIObject.fragment === null

  return (
    isValidScheme &&
    isValidSlashes &&
    isValidAuthority &&
    isValidPath &&
    isValidQuery &&
    isValidFragment
  )
}
URIObjectValidator.isURIObject = isURIObject

module.exports = URIObjectValidator
