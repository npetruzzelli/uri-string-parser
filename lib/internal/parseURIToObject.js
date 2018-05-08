'use strict'

const deleteEmptyProperties = require('./deleteEmptyProperties')
const uriRegExpReplacer = require('./uriRegExpReplacer')

/**
 * The parsed string represented as a URI and a URL
 * @typedef {Object} ParsedURIString
 * @property {ParsedURI} uri - The parsed string divided into the up to five URI components
 * @property {ParsedURL} url - The parsed string divided into the up to nine URL components
 */

/**
 * The parsed string divided into the up to five URI components
 * @typedef {Object} ParsedURI
 * @property {String} [scheme]     -
 * @property {String} [authority]  -
 * @property {String} [path]       -
 * @property {String} [query]      -
 * @property {String} [fragment]   -
 */

/**
 * The parsed string divided into the up to nine URL components
 * @typedef {Object} ParsedURL
 * @property {String} [protocol]   -
 * @property {String} [slashes]    -
 * @property {String} [username]   -
 * @property {String} [password]   -
 * @property {String} [hostname]   -
 * @property {String} [port]       -
 * @property {String} [pathname]   -
 * @property {String} [search]     -
 * @property {String} [hash]       -
 */

/**
 * Returns the parsed string represented as a URI object and a URL object.
 * @param {String} uri - The URI to be parsed
 * @returns {ParsedURIString}
 */
function parseURIToObject(uri) {
  let parsedObject
  // https://tools.ietf.org/html/rfc3986#appendix-B
  const URI_RE = new RegExp(
    '^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?'
  )
  parsedObject = JSON.parse(uri.replace(URI_RE, uriRegExpReplacer))
  deleteEmptyProperties(parsedObject.uri)
  deleteEmptyProperties(parsedObject.url)
  return parsedObject
}

module.exports = parseURIToObject
