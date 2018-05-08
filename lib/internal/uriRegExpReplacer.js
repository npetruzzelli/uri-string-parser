'use strict'

const parseURIAuthority = require('../parse-uri-authority')

/**
 * A replacer function for `String.prototype.replace()` intended to work with
 * the regular expression found in Appendix B of RFC3986 for parsing URIs. It
 * returns a stringified object containing the URI as both a URI object and a
 * URL object.
 *
 * @param {String} match - The matched substring.
 * @param {String} $1 - Protocol
 * @param {String} $2 - Scheme (Protocol without trailing ":")
 * @param {String} $3 - Authority with slashes
 * @param {String} $4 - Authority without slashes
 * @param {String} $5 - Path
 * @param {String} $6 - Search
 * @param {String} $7 - Query (Search without leading "?")
 * @param {String} $8 - Hash
 * @param {String} $9 - Fragment (Hash without leading "#")
 * @param {String} offset - The offset of the matched substring within the whole string being examined.
 * @param {String} str    - The whole string being examined.
 * @returns {String}
 *
 * @see [RFC3986]{@link https://tools.ietf.org/html/rfc3986#appendix-B}
 */
function uriRegExpReplacer(
  match,
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  offset,
  str
) {
  let authority
  let parsedObject
  authority = parseURIAuthority($3, true)
  parsedObject = {
    uri: {
      scheme: $2,
      authority: $4,
      path: $5,
      query: $7,
      fragment: $9
    },
    url: {
      protocol: $1,
      slashes: authority.slashes,
      username: authority.username,
      password: authority.password,
      hostname: authority.hostname,
      port: authority.port,
      pathname: $5,
      search: $6,
      hash: $8

      // Don't include host or origin as the data for URIs. It is already
      // represented by a combination of other fields. The purpose of the module
      // is to break up a string. Beyond this, it in no way modifies it or
      // creates new or calculated values.
    }
  }
  return JSON.stringify(parsedObject)
}

module.exports = uriRegExpReplacer
