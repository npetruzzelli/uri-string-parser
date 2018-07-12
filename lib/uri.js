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

/**
 * fragment = *( pchar / "/" / "?" )
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIFragment
 * @return {Boolean}
 */
URI.isURIFragment = function URIisURIFragment(possibleURIFragment) {
  return URI.isURIFragmentOrQuery(possibleURIFragment)
}

/**
 * fragment = *( pchar / "/" / "?" )
 * query    = *( pchar / "/" / "?" )
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIFragmentOrQuery
 * @return {Boolean}
 */
URI.isURIFragmentOrQuery = function URIisURIFragmentOrQuery(
  possibleURIFragmentOrQuery
) {
  if (!Utils.isString(possibleURIFragmentOrQuery)) {
    return false
  }

  // Fragments and queries can be zero or more of the defined characters.
  // That makes an empty string a valid value for both.
  if (possibleURIFragmentOrQuery === '') {
    return true
  }
  var fragmentOrQueryRegExp = /^(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\-._~!$&'()*+,;=:@/?])*$/
  var fragmentOrQueryMatches = Utils.unmatchedAsNull(
    possibleURIFragmentOrQuery.match(fragmentOrQueryRegExp)
  )
  return Utils.hasMatch(fragmentOrQueryMatches)
}

/**
 * hier-part = "//" authority path-abempty
 *           / path-absolute
 *           / path-rootless
 *           / path-empty
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIHierPart
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIPart}
 */
URI.isURIHierPart = function URIisURIHierPart(
  possibleURIHierPart,
  returnParse
) {
  return URI.isURIHierPartOrRelativePart(
    possibleURIHierPart,
    'hier-part',
    returnParse
  )
}

/**
 * hier-part     = "//" authority path-abempty
 *               / path-absolute
 *               / path-rootless
 *               / path-empty
 *
 * relative-part = "//" authority path-abempty
 *               / path-absolute
 *               / path-noscheme
 *               / path-empty
 *
 * `relative-part` is pretty much the same as `hier-part` except
 * `path-rootless` is replaced with `path-noscheme`.
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIPart
 * @param {('hier-part'|'relative-part')} [type='hier-part']
 *     - Determines what rules should be used in validation and parsing.
 *     Options: `hier-part`|`relative-part`. Default: `hier-part`.
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIPart}
 */
URI.isURIHierPartOrRelativePart = function URIisURIHierPartOrRelativePart(
  possibleURIPart,
  type,
  returnParse
) {
  var AUTHORITY_PATH_ABEMPTY = 'authority-path-abempty'
  var HIER_PART = 'hier-part'
  var RELATIVE_PART = 'relative-part'
  var PATH_ABSOLUTE = 'path-absolute'
  var PATH_EMPTY = 'path-empty'
  var PATH_NOSCHEME = 'path-noscheme'
  var PATH_ROOTLESS = 'path-rootless'
  var effectiveType
  var firstSlashInAuthorityIndex
  var hostname
  var isParsing
  var isValidAuthority
  var isValidURIPart
  var parsedAuthority
  var parsedURIPart
  var partType
  var password
  var port
  var possibleAuthorityAndAbempty
  var possibleAuthority
  var possiblePath
  var possiblePathAbempty
  var slashes
  var startsWithSlashes
  var username

  isParsing = returnParse === true
  if (!Utils.isString(possibleURIPart)) {
    return false
  }
  switch (type) {
    case HIER_PART:
    case RELATIVE_PART:
      effectiveType = type
      break
    default:
      effectiveType = HIER_PART
  }
  isValidURIPart = false
  partType = null
  startsWithSlashes = possibleURIPart.substr(0, 2) === '//'
  if (startsWithSlashes === true) {
    possibleAuthorityAndAbempty = possibleURIPart.substr(2)
    firstSlashInAuthorityIndex = possibleAuthorityAndAbempty.indexOf('/')
    if (firstSlashInAuthorityIndex < 0) {
      possibleAuthority = possibleAuthorityAndAbempty
      possiblePathAbempty = ''
    } else {
      possibleAuthority = possibleAuthorityAndAbempty.substring(
        0,
        firstSlashInAuthorityIndex
      )
      possiblePathAbempty = possibleAuthorityAndAbempty.substring(
        firstSlashInAuthorityIndex
      )
    }
    if (isParsing === true) {
      slashes = '//'
      possiblePath = possiblePathAbempty
      parsedAuthority = URI.isURIAuthority(possibleAuthority, true)
      isValidAuthority = parsedAuthority.isValid
      username = parsedAuthority.username
      password = parsedAuthority.password
      hostname = parsedAuthority.hostname
      port = parsedAuthority.port
    } else {
      isValidAuthority = URI.isURIAuthority(possibleAuthority)
    }
    isValidURIPart =
      isValidAuthority && URI.isURIPathAbempty(possiblePathAbempty)
    if (isValidURIPart === true) {
      partType = AUTHORITY_PATH_ABEMPTY
    }
  } else {
    if (isParsing === true) {
      possibleAuthority = null
      slashes = null
      possiblePath = null
      username = null
      password = null
      hostname = null
      port = null
    }
    if (effectiveType === RELATIVE_PART) {
      if (URI.isURIPathAbsolute(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_ABSOLUTE
      } else if (URI.isURIPathNoScheme(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_NOSCHEME
      } else if (URI.isURIPathEmpty(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_EMPTY
      }
    } else {
      // Default: effectiveType === HIER_PART
      if (URI.isURIPathAbsolute(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_ABSOLUTE
      } else if (URI.isURIPathRootless(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_ROOTLESS
      } else if (URI.isURIPathEmpty(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_EMPTY
      }
    }
  }
  if (isParsing === true) {
    /**
     * @type {URIPart}
     */
    parsedURIPart = {
      authority: possibleAuthority,
      hostname: hostname,
      isValid: isValidURIPart,
      partType: partType,
      password: password,
      path: possiblePath,
      port: port,
      slashes: slashes,
      username: username
    }
    if (possiblePath == null) {
      // Per section 3.3 of RFC3986
      // https://tools.ietf.org/html/rfc3986#section-3.3
      // "A path is always defined for a URI, though the defined path may be
      // empty (zero length)."
      parsedURIPart.path = ''
    }
    return parsedURIPart
  } else {
    return isValidURIPart
  }
}

/**
 * host = IP-literal / IPv4address / reg-name
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIHost
 * @return {Boolean}
 */
URI.isURIHost = function URIisURIHost(possibleURIHost) {
  var isValidURIHost
  if (!Utils.isString(possibleURIHost)) {
    return false
  }
  isValidURIHost =
    URI.isURIIPLiteral(possibleURIHost) === true ||
    URI.isURIIPv4Address(possibleURIHost) === true ||
    URI.isURIRegName(possibleURIHost) === true
  return isValidURIHost
}

/**
 * IP-literal = "[" ( IPv6address / IPvFuture  ) "]"
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIIPLiteral
 * @return {Boolean}
 */
URI.isURIIPLiteral = function URIisURIIPLiteral(possibleURIIPLiteral) {
  var endsWithRightBracket
  var possibleIP
  var startsWithLeftBracket
  if (!Utils.isString(possibleURIIPLiteral)) {
    return false
  }
  startsWithLeftBracket = possibleURIIPLiteral.substr(0, 1) === '['
  endsWithRightBracket = possibleURIIPLiteral.substr(-1) === ']'
  if (!startsWithLeftBracket && !endsWithRightBracket) {
    return false
  }
  possibleIP = possibleURIIPLiteral.substring(
    1,
    possibleURIIPLiteral.length - 1
  )
  return URI.isURIIPv6Address(possibleIP) || URI.isURIIPvFuture(possibleIP)
}

/**
 * IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIIPv4Address
 * @return {Boolean}
 */
URI.isURIIPv4Address = function URI(possibleURIIPv4Address) {
  var ipv4AddressMatches
  var ipv4AddressPattern
  var ipv4AddressRegExp
  if (!Utils.isString(possibleURIIPv4Address)) {
    return false
  }
  ipv4AddressPattern = [
    // Start the regular expression and anchor it to the beginning of the string.
    '/^',

    // IPv4 Decimal Octet 1
    '([0-9]|(?:[1-9][0-9])|(?:1[1-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5]))',

    // IPv4 Decimal Octet Separator
    '\\.',

    // IPv4 Decimal Octet 2
    '([0-9]|(?:[1-9][0-9])|(?:1[1-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5]))',

    // IPv4 Decimal Octet Separator
    '\\.',

    // IPv4 Decimal Octet 3
    '([0-9]|(?:[1-9][0-9])|(?:1[1-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5]))',

    // IPv4 Decimal Octet Separator
    '\\.',

    // IPv4 Decimal Octet 4
    '([0-9]|(?:[1-9][0-9])|(?:1[1-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5]))',

    // End the regular expression and anchor it to the end of the string.
    '$/'
  ].join('')
  ipv4AddressRegExp = new RegExp(ipv4AddressPattern)
  ipv4AddressMatches = possibleURIIPv4Address.match(ipv4AddressRegExp)
  return Utils.hasMatch(ipv4AddressMatches)
}

/**
 * IPv6address =                            6( h16 ":" ) ls32
 *             /                       "::" 5( h16 ":" ) ls32
 *             / [               h16 ] "::" 4( h16 ":" ) ls32
 *             / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
 *             / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
 *             / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
 *             / [ *4( h16 ":" ) h16 ] "::"              ls32
 *             / [ *5( h16 ":" ) h16 ] "::"              h16
 *             / [ *6( h16 ":" ) h16 ] "::"
 *
 * Currently not supported. Will always return false. Placeholder for future
 * development.
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIIPv6Address
 * @return {Boolean}
 */
URI.isURIIPv6Address = function URIisURIIPv6Address(possibleURIIPv6Address) {
  return false
}

/**
 * IPvFuture = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
 *           ; The URI spec calls for HEXDIG to be case-insensitive for
 *             comparison.
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIIPvFuture
 * @return {Boolean}
 */
URI.isURIIPvFuture = function URIisURIIPvFuture(possibleURIIPvFuture) {
  var ipvFutureMatches
  var ipvFutureRegExp
  if (!Utils.isString(possibleURIIPvFuture)) {
    return false
  }
  ipvFutureRegExp = /^[Vv]([[0-9A-Fa-f]]+)\.([A-Za-z0-9\-._~!$&'()*+,;=:]+)$/
  ipvFutureMatches = possibleURIIPvFuture.match(ipvFutureRegExp)
  return Utils.hasMatch(ipvFutureMatches)
}

/**
 *
 * @memberof URI
 * @static
 * @param {*}        possibleURIReference
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIReference}
 */
URI.isURIOrRelativeRef = function URIisURIOrRelativeRef(
  possibleURIReference,
  type,
  returnParse
) {
  var HIER_PART = 'hier-part'
  var RELATIVE_PART = 'relative-part'
  var RELATIVE_REF = 'relative-ref'
  var URI_REF = 'uri'

  var effectiveType
  var isParsing
  var isValidURI
  var isValidURIFragment
  var isValidURIPart
  var isValidURIQuery
  var isValidURIScheme
  var parsedURIPart
  var path
  var possibleURIFragment
  var possibleURIPart
  var possibleURIQuery
  var possibleURIScheme
  var possibleURLHash
  var possibleURLProtocol
  var possibleURLSearch
  var protocolPattern
  var uriMatches
  var uriPattern
  var uriPatternParts
  var uriReference
  var uriRegExp

  isParsing = returnParse === true
  if (!Utils.isString(possibleURIReference)) {
    return false
  }
  switch (type) {
    case RELATIVE_REF:
    case URI_REF:
      effectiveType = type
      break
    default:
      effectiveType = URI_REF
  }
  uriPatternParts = [
    // Start the regular expression and anchor it to the beginning of the string.
    '/^',

    //  The URI hier-part, not greedy.
    '(.*?)',

    // The URL search and URI query, not greedy.
    "(\\?((?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\\-._~!$&'()*+,;=:@\\/?])*?))?",

    // The URL hash and URI fragment, not greedy.
    "(#((?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\\-._~!$&'()*+,;=:@\\/?])*?))?",

    // End the regular expression and anchor it to the end of the string.
    '$/'
  ]
  if (effectiveType === URI_REF) {
    // The URL Protocol and URI scheme, greedy
    protocolPattern = '(([A-Za-z][A-Za-z0-9+\\-.]*):)'

    // Add the protocol pattern as the second item in the array.
    uriPatternParts.splice(1, 0, protocolPattern)
  }
  uriPattern = uriPatternParts.join('')
  uriRegExp = new RegExp(uriPattern)
  uriMatches = Utils.unmatchedAsNull(possibleURIReference.match(uriRegExp))
  if (effectiveType === RELATIVE_REF) {
    possibleURLProtocol = null
    possibleURIScheme = null
    possibleURIPart = uriMatches[1]
    possibleURLSearch = uriMatches[2]
    possibleURIQuery = uriMatches[3]
    possibleURLHash = uriMatches[4]
    possibleURIFragment = uriMatches[5]

    // Path is always defined, even if empty
    if (possibleURIPart == null) {
      possibleURIPart = ''
    }
    isValidURIScheme = true
    if (isParsing === true) {
      parsedURIPart = URI.isURIHierPartOrRelativePart(
        possibleURIPart,
        RELATIVE_PART,
        true
      )
      isValidURIPart = parsedURIPart.isValid
    } else {
      isValidURIPart = URI.isURIHierPartOrRelativePart(
        possibleURIPart,
        RELATIVE_PART
      )
    }
  } else {
    // Default: effectiveType === URI_REF
    possibleURLProtocol = uriMatches[1]
    possibleURIScheme = uriMatches[2]
    possibleURIPart = uriMatches[3]
    possibleURLSearch = uriMatches[4]
    possibleURIQuery = uriMatches[5]
    possibleURLHash = uriMatches[6]
    possibleURIFragment = uriMatches[7]

    // Path is always defined, even if empty
    if (possibleURIPart == null) {
      possibleURIPart = ''
    }
    isValidURIScheme = URI.isURIScheme(possibleURIScheme)
    if (isParsing === true) {
      parsedURIPart = URI.isURIHierPartOrRelativePart(
        possibleURIPart,
        HIER_PART,
        true
      )
      isValidURIPart = parsedURIPart.isValid
    } else {
      isValidURIPart = URI.isURIHierPartOrRelativePart(
        possibleURIPart,
        HIER_PART
      )
    }
  }
  if (possibleURIQuery == null && possibleURLSearch === '?') {
    // If the question mark exists, then the query is defined, but empty instead
    // of not existing at all.
    possibleURIQuery = ''
  }
  isValidURIQuery = possibleURIQuery == null || URI.isURIQuery(possibleURIQuery)
  if (possibleURIFragment == null && possibleURLHash === '#') {
    // If the number sign exists, then the fragment is defined, but empty
    // instead of not existing at all.
    possibleURIFragment = ''
  }
  isValidURIFragment =
    possibleURIFragment == null || URI.isURIFragment(possibleURIFragment)
  isValidURI =
    isValidURIScheme === true &&
    isValidURIPart === true &&
    isValidURIQuery === true &&
    isValidURIFragment === true
  if (isParsing === true) {
    path = parsedURIPart.path
    /**
     * @type {URIReference}
     */
    uriReference = {
      authority: parsedURIPart.authority,
      fragment: possibleURIFragment,
      hash: possibleURLHash,
      hostname: parsedURIPart.hostname,
      isValid: isValidURI,
      partType: undefined,
      password: parsedURIPart.password,
      path: path,
      pathname: path,
      port: parsedURIPart.port,
      protocol: possibleURLProtocol,
      query: possibleURIQuery,
      scheme: possibleURIScheme,
      search: possibleURLSearch,
      slashes: parsedURIPart.slashes,
      uriType: undefined,
      username: parsedURIPart.username
    }
    if (isValidURI === true) {
      uriReference.partType = parsedURIPart.partType
      uriReference.uriType = effectiveType
    }
    return uriReference
  } else {
    return isValidURI
  }
}

/**
 * path-abempty = *( "/" segment )
 *              ; begins with "/" or is empty
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIPathAbempty
 * @return {Boolean}
 */
URI.isURIPathAbempty = function URIisURIPathAbempty(possibleURIPathAbempty) {
  var pathAbemptyMatches
  var pathAbemptyRegExp
  if (!Utils.isString(possibleURIPathAbempty)) {
    return false
  }
  if (possibleURIPathAbempty === '') {
    // Zero or more of the defined characters means an empty string is valid.
    return true
  }
  pathAbemptyRegExp = /^(?:\/(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\-._~!$&'()*+,;=:@])*)*$/
  pathAbemptyMatches = URI.unmatchedAsNull(
    possibleURIPathAbempty.match(pathAbemptyRegExp)
  )
  return Utils.hasMatch(pathAbemptyMatches)
}

/**
 * path-absolute = "/" [ segment-nz *( "/" segment ) ]
 *               ; begins with "/" but not "//"
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIPathAbsolute
 * @return {Boolean}
 */
URI.isURIPathAbsolute = function URIisURIPathAbsolute(possibleURIPathAbsolute) {
  var pathAbsoluteMatches
  var pathAbsolutePattern
  var pathAbsoluteRegExp
  if (!Utils.isString(possibleURIPathAbsolute)) {
    return false
  }
  pathAbsolutePattern = [
    // Start the regular expression and anchor it to the beginning of the string.
    '/^',

    // path-absolute begins with "/" but not "//"
    '\\/',

    // Begin Optional Segments
    '(?:',

    // First non-zero length segment, not greedy
    "(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\\-._~!$&'()*+,;=:@])+?",

    // Zero or more normal path separator and segment combinations
    "(?:\\/(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\\-._~!$&'()*+,;=:@])*)*",

    // End Optional Segments
    ')?',

    // End the regular expression and anchor it to the end of the string.
    '$/'
  ].join('')
  pathAbsoluteRegExp = new RegExp(pathAbsolutePattern)
  pathAbsoluteMatches = Utils.unmatchedAsNull(
    possibleURIPathAbsolute.match(pathAbsoluteRegExp)
  )
  return Utils.hasMatch(pathAbsoluteMatches)
}

/**
 * path-empty = 0<pchar>
 *            ; zero characters
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIPathEmpty
 * @return {Boolean}
 */
URI.isURIPathEmpty = function URIisURIPathEmpty(possibleURIPathEmpty) {
  return possibleURIPathEmpty === ''
}

/**
 * path-noscheme = segment-nz-nc *( "/" segment )
 *               ; begins with a non-colon segment
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIPathNoScheme
 * @return {Boolean}
 */
URI.isURIPathNoScheme = function URIisURIPathNoScheme(possibleURIPathNoScheme) {
  var pathNoSchemeMatches
  var pathNoSchemePattern
  var pathNoSchemeRegExp
  if (!Utils.isString(possibleURIPathNoScheme)) {
    return false
  }
  pathNoSchemePattern = [
    // Start the regular expression and anchor it to the beginning of the string.
    '/^',

    // First non-zero length, non-colon segment, not greedy
    "(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\\-._~!$&'()*+,;=@])+?",

    // Zero or more normal path separator and segment combinations
    "(?:\\/(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\\-._~!$&'()*+,;=:@])*)*",

    // End the regular expression and anchor it to the end of the string.
    '$/'
  ].join('')
  pathNoSchemeRegExp = new RegExp(pathNoSchemePattern)
  pathNoSchemeMatches = Utils.unmatchedAsNull(
    possibleURIPathNoScheme.match(pathNoSchemeRegExp)
  )
  return Utils.hasMatch(pathNoSchemeMatches)
}

/**
 * path-rootless = segment-nz *( "/" segment )
 *               ; begins with a segment
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIPathRootless
 * @return {Boolean}
 */
URI.isURIPathRootless = function URIisURIPathRootless(possibleURIPathRootless) {
  var pathRootlessMatches
  var pathRootlessPattern
  var pathRootlessRegExp
  if (!Utils.isString(possibleURIPathRootless)) {
    return false
  }
  pathRootlessPattern = [
    // Start the regular expression and anchor it to the beginning of the string.
    '/^',

    // First non-zero length segment, not greedy
    "(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\\-._~!$&'()*+,;=:@])+?",

    // Zero or more normal path separator and segment combinations
    "(?:\\/(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\\-._~!$&'()*+,;=:@])*)*",

    // End the regular expression and anchor it to the end of the string.
    '$/'
  ].join('')
  pathRootlessRegExp = new RegExp(pathRootlessPattern)
  pathRootlessMatches = Utils.unmatchedAsNull(
    possibleURIPathRootless.match(pathRootlessRegExp)
  )
  return Utils.hasMatch(pathRootlessMatches)
}
/**
 * query = *( pchar / "/" / "?" )
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIQuery
 * @return {Boolean}
 */
URI.isURIQuery = function URIisURIQuery(possibleURIQuery) {
  return URI.isURIFragmentOrQuery(possibleURIQuery)
}


/**
 * reg-name = *( unreserved / pct-encoded / sub-delims )
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIRegName
 * @return {Boolean}
 */
URI.isURIRegName = function URIisURIRegName(possibleURIRegName) {
  var regNameMatches
  var regNameRegExp
  if (!Utils.isString(possibleURIRegName)) {
    return false
  }
  if (possibleURIRegName === '') {
    // Zero or more characters means an empty string is valid.
    return true
  }
  regNameRegExp = /^(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\-._~!$&'()*+,;=])*$/
  regNameMatches = possibleURIRegName.match(regNameRegExp)
  return Utils.hasMatch(regNameMatches)
}

/**
 * relative-part = "//" authority path-abempty
 *               / path-absolute
 *               / path-noscheme
 *               / path-empty
 *
 * @memberof URI
 * @static
 * @param {*} possibleURIRelativePart
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIPart}
 */
URI.isURIRelativePart = function URIisURIRelativePart(
  possibleURIRelativePart,
  returnParse
) {
  return URI.isURIHierPartOrRelativePart(
    possibleURIRelativePart,
    'relative-part',
    returnParse
  )
}

/**
 * relative-ref  = relative-part [ "?" query ] [ "#" fragment ]
 *
 * @memberof URI
 * @static
 * @param {*}        possibleURIRelativeRef
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIReference}
 */
URI.isURIRelativeRef = function URI(possibleURIRelativeRef, returnParse) {
  return URI.isURIOrRelativeRef(
    possibleURIRelativeRef,
    'relative-ref',
    returnParse
  )
}
