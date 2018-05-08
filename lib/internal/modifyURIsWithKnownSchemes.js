'use strict'

/**
 * The processed URI and information on how it was processed.
 * @typedef {Object} URIKnownSchemeModification
 * @property {Boolean} assumptionsAllowed      - The effective known scheme setting based on supplied options and defaults.
 * @property {Boolean} hadKnownScheme          - An indication of whether or not a known scheme was identified.
 * @property {Boolean} parseSlashlessAuthority - The effective known scheme setting based on supplied options and defaults.
 * @property {Boolean} slashesWereAdded        - Indicates that the modification added two slashes to the URI after the protocol's ":"
 * @property {String}  uri                     - The processed URI.
 * @property {Boolean} uriWasModified          - An indication of whether or not the URI was modified.
 */

/**
 * Processes the URI based on known schemes and returns it along with
 * information on how it was processed.
 * @param {String}   uri                 - The URI being parsed.
 * @param {String[]} knownSchemes        - A list of known schemes.
 * @param {Object}   knownSchemesOptions - Configuration options for known schemes.
 * @returns {URIKnownSchemeModification}
 */
function modifyURIsWithKnownSchemes(uri, knownSchemes, knownSchemesOptions) {
  let assumptionsAllowed
  let effectiveUri
  let knownProtocol
  let knownScheme
  let knownSchemeOptions
  let knownSchemesLength
  let parseSlashlessAuthority
  let s
  let slashesWereAdded
  let uriHasDoubleSlashes
  let uriHasKnownScheme
  let uriWasModified

  knownSchemesLength = knownSchemes.length

  assumptionsAllowed = true
  effectiveUri = uri
  parseSlashlessAuthority = true
  slashesWereAdded = false
  uriHasDoubleSlashes = false
  uriHasKnownScheme = false
  uriWasModified = false
  if (uri.startsWith('//')) {
    uriHasDoubleSlashes = true
  } else if (knownSchemesLength > 0) {
    for (s = 0; s < knownSchemesLength; s += 1) {
      knownScheme = knownSchemes[s]
      knownProtocol = knownScheme + ':'
      if (uri.startsWith(knownProtocol)) {
        uriHasKnownScheme = true
        break
      }
    }
    if (uriHasKnownScheme === true) {
      uriHasDoubleSlashes = uri.startsWith(knownProtocol + '//')
      knownSchemeOptions = knownSchemesOptions[knownScheme] || {}
      assumptionsAllowed = knownSchemeOptions.assumptionsAllowed === true
      parseSlashlessAuthority =
        knownSchemeOptions.parseSlashlessAuthority === true
      if (uriHasDoubleSlashes !== true && parseSlashlessAuthority) {
        let protocolLength = knownProtocol.length
        let uriLeft = knownProtocol
        let uriRight = uri.substring(protocolLength)

        effectiveUri = uriLeft + '//' + uriRight
        slashesWereAdded = true
        uriWasModified = true
      }
    }
  }
  return {
    assumptionsAllowed: assumptionsAllowed,
    hadKnownScheme: uriHasKnownScheme,
    parseSlashlessAuthority: parseSlashlessAuthority,
    slashesWereAdded: slashesWereAdded,
    uri: effectiveUri,
    uriWasModified: uriWasModified
  }
}

module.exports = modifyURIsWithKnownSchemes
