'use strict'

// When we assume that the scheme (protocol) uses double slashes, we can prepend
// the slashes if they are not already present. This may lead to more accurate
// processing of the URI's authority and path. While it may be better able to
// break up the URL as a human might, it does not, in any way, make the URL more
// or less valid.

/**
 * The processed URI and information on how it was processed.
 * @typedef {Object} URIDoubleSlashModification
 * @property {Boolean} slashesWereAdded - Indicates that the modification prepended two slashes to the URI.
 * @property {String}  uri              - The processed URI.
 * @property {Boolean} uriWasModified   - A indication of whether or not the URI was modified.
 */

/**
 * Prepends `//` to the URI if it is not found by the first `/` or the end of the string.
 * @param {String} uri - The URI being parsed.
 * @returns {URIDoubleSlashModification}
 */
function modifyURIWithAssumptions(uri) {
  let doubleSlashIndex
  let effectiveUri
  let slashIndex
  let slashesWereAdded
  let uriWasModified

  effectiveUri = uri
  slashesWereAdded = false
  uriWasModified = false

  doubleSlashIndex = uri.indexOf('//')
  slashIndex = uri.indexOf('/')

  if (doubleSlashIndex === -1 || doubleSlashIndex > slashIndex) {
    effectiveUri = '//' + uri
    uriWasModified = true
    slashesWereAdded = true
  }
  return {
    slashesWereAdded: slashesWereAdded,
    uri: effectiveUri,
    uriWasModified: uriWasModified
  }
}

module.exports = modifyURIWithAssumptions
