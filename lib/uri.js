'use strict'

/**
 * The authority portion of the URI.
 * @typedef {String} URIAuthorityString
 */
/**
 * The fragment portion of the URI. An empty string means that the fragment was
 * defined, but left empty.
 * @typedef {String} URIFragmentString
 */
/**
 * The type of URI Part that was detected by either `hier-part` or
 * `relative-part`.
 * @typedef {('authority-path-abempty'|'path-absolute'|'path-empty'|'path-noscheme'|'path-rootless')} URIPartType
 */
/**
 * The path portion of the URI. Path is always a string, even if it is empty.
 * @typedef {String} URIPathString
 */
/**
 * The query portion of the URI. An empty string means that the query was
 * defined, but left empty.
 * @typedef {String} URIQueryString
 */
/**
 * The scheme portion of the URI.
 * @typedef {String} URISchemeString
 */
/**
 * Indicates whether or not the authority started with two forward slashes.
 * @typedef {('//')} URISlashes
 */
/**
 * The type of URI that was detected.
 * @typedef {('relative-ref'|'uri')} URIType
 */
/**
 * The hash portion of the URL. This may consist of just the "#" character,
 * indicating that a hash was defined, but left empty. This is identical to the
 * URI's fragment, with the exception that it also includes the leading number
 * sign "#".
 * @typedef {String} URLHashString
 */
/**
 * The hostname component, if any, of the host portion of the URI authority.
 * @typedef {String} URLHostnameString
 */
/**
 * The password component, if any, of the userinfo portion of the URI authority.
 * @typedef {String} URLPasswordString
 */
/**
 * The pathname portion of the URL. Pathname is always a string, even if it is
 * empty. This value must be identical to URI's `path` value. It is included for
 * convenience since URLs use `pathname` and URIs use `path` as the key for this
 * information.
 * @typedef {String} URLPathnameString
 */
/**
 * The port component, if any, of the host portion of the URI authority. An
 * empty string means that the port was defined, but left empty.
 * @typedef {String} URLPortString
 */
/**
 * The protocol portion of the URL. This is identical to the URI's scheme, with
 * the exception that it also includes the trailing colon ":".
 * @typedef {String} URLProtocolString
 */
/**
 * The search portion of the URL. This may consist of just the "?" character,
 * indicating that a search was defined, but left empty. This is identical to
 * the URI's query, with the exception that it also includes the leading
 * question mark "?".
 * @typedef {String} URLSearchString
 */
/**
 * The username component, if any, of the userinfo portion of the URI authority.
 * @typedef {String} URLUsernameString
 */
/**
 * @typedef {Object} URIData
 * @property {Boolean} isValid Was the data valid?
 */
/**
 * @typedef {Object} URIAuthority
 * @extends URIData
 * @property {URLHostnameString|null} hostname
 * @property {URLPasswordString|null} password
 * @property {URLPortString|null} port
 * @property {URLUsernameString|null} username
 */
/**
 * @typedef {Object} URIPart
 * @extends URIAuthority
 * @property {URIAuthorityString|null} authority
 * @property {URIPartType|null} partType
 * @property {URIPathString} path
 * @property {URISlashes|null} slashes
 */
/**
 * @typedef {Object} URIReference
 * @extends URIPart
 * @property {URIFragmentString|null} fragment
 * @property {URLHashString|null} hash
 * @property {URLPathnameString|null} pathname
 * @property {URLProtocolString|null} protocol
 * @property {URIQueryString|null} query
 * @property {URISchemeString|null} scheme
 * @property {URLSearchString|null} search
 * @property {URIType|null} uriType
 */
/**
 * @typedef {Object} ParsedURI
 * @property {URIAuthorityString|null} authority
 * @property {URIFragmentString|null} fragment
 * @property {URIPathString} path
 * @property {URIQueryString|null} query
 * @property {URISchemeString|null} scheme
 * @property {URISlashes|null} slashes
 */
/**
 * @typedef {Object} ParsedURL
 * @property {URLHashString|null} hash
 * @property {URLHostnameString|null} hostname
 * @property {URLPasswordString|null} password
 * @property {URLPathnameString|null} pathname
 * @property {URLPortString|null} port
 * @property {URLProtocolString|null} protocol
 * @property {URLSearchString|null} search
 * @property {URISlashes|null} slashes
 * @property {URLUsernameString|null} username
 */
/**
 * @typedef {Object} ParsedURIReference
 * @property {Boolean} isValid Was the data valid?
 * @property {URIPartType|null} partType
 * @property {ParsedURI} uri
 * @property {URIType|null} uriType
 * @property {ParsedURL} url
 */

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
 * Modeled after the lodash.isString method.
 * @param {*} possibleString
 */
Utils.isString = function isString(possibleString) {
  var stringTag = '[object String]'
  var possibleStringTag = Object.prototype.toString.call(possibleString)
  var isObjectLike =
    possibleString != null && typeof possibleString === 'object'
  return (
    typeof possibleString === 'string' ||
    (!Array.isArray(possibleString) &&
      isObjectLike(possibleString) &&
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

/**
 * @class
 */
function URI() {}

/**
 * Determine if the argument is an absolute URL
 *
 * absolute-URI  = scheme ":" hier-part [ "?" query ]
 *
 * Pretty much the same thing as URI.isURI() except fragments are not allowed,
 * not even empty fragments.
 *
 * @memberof URI
 * @static
 * @param {*}        possibleAbsoluteURI
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIReference}
 */
URI.isAbsoluteURI = function URIisAbsoluteURI(
  possibleAbsoluteURI,
  returnParse
) {
  var isParsing = returnParse === true
  var parsedURI = URI.isURI(possibleAbsoluteURI, true)
  if (parsedURI.hash != null) {
    parsedURI.is_valid = false
  }
  if (isParsing) {
    return parsedURI
  } else {
    return parsedURI.is_valid
  }
}

/**
 * URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
 *
 * @memberof URI
 * @static
 * @param {*}        possibleAbsoluteURI
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIReference}
 */
URI.isURI = function URIisURI(possibleURI, returnParse) {
  return URI.isURIOrRelativeRef(possibleURI, 'uri', returnParse)
}

/**
 * authority = [ userinfo "@" ] host [ ":" port ]
 *
 * @memberof URI
 * @static
 * @param {*}        possibleURIAuthority
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIAuthority}
 */
URI.isURIAuthority = function URIisURIAuthority(
  possibleURIAuthority,
  returnParse
) {
  if (!Utils.isString(possibleURIAuthority)) {
    return false
  }
  var isParsing = returnParse === true
  var authorityPattern = [
    // Start the regular expression and anchor it to the beginning of the string.
    '/^',

    // The URI userinfo, not greedy
    "(?:((?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9-._~!$&'()*+,;=:])*?)@)?",

    //  The URI host, not greedy
    '(.*?)',

    // The URI port
    '(:([0-9]*))?',

    // End the regular expression and anchor it to the end of the string.
    '$/'
  ].join('')
  var authorityRegExp = new RegExp(authorityPattern)
  var authorityMatches = Utils.unmatchedAsNull(
    possibleURIAuthority.match(authorityRegExp)
  )
  var possibleURIUserInfo = authorityMatches[1]
  var possibleURIHost = authorityMatches[2]
  var possibleURIPortAndColon = authorityMatches[3]
  var possibleURIPort = authorityMatches[4]
  var isValidURIHost = URI.isURIHost(possibleURIHost)
  var isValidURIAuthority = false
  var isValidURIPort
  var isValidURIUserInfo
  var possibleURLUserName
  var possibleURLPassword
  var firstUserInfoColonIndex
  var parsedAuthority

  if (isValidURIHost) {
    isValidURIUserInfo =
      possibleURIUserInfo == null || URI.isURIUserInfo(possibleURIUserInfo)
    if (possibleURIPort == null && possibleURIPortAndColon === ':') {
      // If the colon exists, then the port is defined, but empty instead of not
      // existing at all.
      possibleURIPort = ''
    }
    isValidURIPort = possibleURIPort == null || URI.isURIPort(possibleURIPort)

    // Already confirmed that host is valid. No need to check it again.
    isValidURIAuthority = isValidURIUserInfo === true && isValidURIPort === true
  }
  if (isParsing) {
    if (possibleURIUserInfo == null) {
      possibleURLUserName = null
      possibleURLPassword = null
    } else {
      firstUserInfoColonIndex = possibleURIUserInfo.indexOf(':')
      if (firstUserInfoColonIndex < 0) {
        possibleURLUserName = possibleURIUserInfo
        possibleURLPassword = null
      } else {
        possibleURLUserName = possibleURIUserInfo.substring(
          0,
          firstUserInfoColonIndex
        )
        possibleURLPassword = possibleURIUserInfo.substring(
          firstUserInfoColonIndex + 1
        )
      }
    }

    /**
     * @type {URIAuthority}
     */
    parsedAuthority = {
      hostname: possibleURIHost,
      isValid: isValidURIAuthority,
      password: possibleURLPassword,
      port: possibleURIPort,
      username: possibleURLUserName
    }
    return parsedAuthority
  } else {
    return isValidURIAuthority
  }
}
