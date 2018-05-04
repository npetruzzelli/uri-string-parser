'use strict'

const _ = {
  isPlainObject: require('lodash.isplainobject')
}

/**
 * @typedef {Object} ParserOptions
 * @property {Boolean}  [assumeSchemeHasSlashes] -
 * @property {String[]} [knownSchemes]           -
 * @property {Object}   [knownSchemesOptions]    -
 */

/**
 * @typedef {Object} ParserSettings
 * @property {Boolean}  assumeSchemeHasSlashes -
 * @property {String[]} knownSchemes           -
 * @property {Object}   knownSchemesOptions    -
 */

/**
 * Takes options as input. Applies defaults and validation if/as needed, and
 * returns effective module settings.
 * @param {ParserOptions} options
 * @returns {ParserSettings}
 */
function createSettings(options) {
  /**
   * @type {ParserOptions}
   */
  let _options
  let assumeSchemeHasSlashes
  let knownSchemes
  let knownSchemesOptions

  _options = options || {}

  // Slash Assumptions
  assumeSchemeHasSlashes = _options.assumeSchemeHasSlashes === true

  // Known Schemes
  if (Array.isArray(_options.knownSchemes)) {
    knownSchemes = _options.knownSchemes
  } else {
    knownSchemes = []
  }

  // Options for Known Schemes
  knownSchemesOptions = _.isPlainObject(_options.knownSchemesOptions)
    ? _options.knownSchemesOptions
    : {}

  return {
    assumeSchemeHasSlashes: assumeSchemeHasSlashes,
    knownSchemes: knownSchemes,
    knownSchemesOptions: knownSchemesOptions
  }
}

module.exports = createSettings
