'use strict'

const createSettings = require('./internal/createSettings')
const modifyURIWithAssumptions = require('./internal/modifyURIWithAssumptions')
const modifyURIsWithKnownSchemes = require('./internal/modifyURIsWithKnownSchemes')
const parseURIToObject = require('./internal/parseURIToObject')

function parseURI(uri, options) {
  let _uri
  let assumptionsAllowed
  let assumeSchemeHasSlashes
  let knownSchemes
  let knownSchemesOptions
  let modificationByAssumption
  let modificationByKnownScheme
  let parsedObject
  let settings
  let slashesWereAdded
  let uriWasModified

  _uri = uri
  settings = createSettings(options)
  assumeSchemeHasSlashes = settings.assumeSchemeHasSlashes
  knownSchemes = settings.knownSchemes
  knownSchemesOptions = settings.knownSchemesOptions

  assumptionsAllowed = true
  slashesWereAdded = false

  // Known schemes attempts to identify schemes that are known ahead of time
  // allowing for schemes that don't use double slashes ('//') to be parsed
  // correctly.
  if (knownSchemes.length > 0) {
    modificationByKnownScheme = modifyURIsWithKnownSchemes(
      uri,
      knownSchemes,
      knownSchemesOptions
    )
    assumptionsAllowed = modificationByKnownScheme.assumptionsAllowed === true
    slashesWereAdded = modificationByKnownScheme.slashesWereAdded
    uriWasModified = modificationByKnownScheme.uriWasModified
    _uri = modificationByKnownScheme.uri
  }

  // Disallow assumptions on relative paths to prevent them from being seen as
  // authorities.
  // The `~` character isn't included here since it is specific to file system
  // paths on specific operating systems. This module is not intended for file
  // system path parsing.
  if (uri.startsWith('.') || uri.startsWith('..')) {
    assumptionsAllowed = false
  }

  // Assume slashes handles instances where no protocol can be identified. It
  // catches a different set of issues than knownSchemes, but due to its nature,
  // it must be the last modification to happen.
  if (
    assumeSchemeHasSlashes === true &&
    assumptionsAllowed === true &&
    slashesWereAdded === false
  ) {
    modificationByAssumption = modifyURIWithAssumptions(_uri)
    slashesWereAdded = modificationByAssumption.slashesWereAdded

    // Be careful to maintain `uriWasModified` if something else already set it
    // to true.
    uriWasModified = uriWasModified || modificationByAssumption.uriWasModified
    _uri = modificationByAssumption.uri
  }

  // TODO: Do something less hackey than a replacer returning stringified JSON.
  parsedObject = parseURIToObject(_uri)

  // Remove slashes modification from the object.
  if (uriWasModified && slashesWereAdded) {
    delete parsedObject.url.slashes
  }
  return parsedObject
}

function parseURIOnly(uri, options) {
  return parseURI(uri, options).uri
}

function parseURLOnly(uri, options) {
  return parseURI(uri, options).url
}

module.exports = parseURI
module.exports.uri = parseURIOnly
module.exports.url = parseURLOnly
