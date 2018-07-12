'use strict'
const Utils = require('./uri-utils')

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

/**
 * @class
 */
function URIStringValidator() {}

/**
 * Determine if the argument is an absolute URL
 *
 * absolute-URI  = scheme ":" hier-part [ "?" query ]
 *
 * Pretty much the same thing as URIStringValidator.isURI() except fragments are not allowed,
 * not even empty fragments.
 *
 * @memberof URIStringValidator
 * @static
 * @param {*}        possibleAbsoluteURI
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIReference}
 */
URIStringValidator.isAbsoluteURI = function URIisAbsoluteURI(
  possibleAbsoluteURI,
  returnParse
) {
  var isParsing = returnParse === true
  var parsedURI = URIStringValidator.isURI(possibleAbsoluteURI, true)
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
 * @memberof URIStringValidator
 * @static
 * @param {*}        possibleAbsoluteURI
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIReference}
 */
URIStringValidator.isURI = function URIisURI(possibleURI, returnParse) {
  return URIStringValidator.isURIOrRelativeRef(possibleURI, 'uri', returnParse)
}

/**
 * authority = [ userinfo "@" ] host [ ":" port ]
 *
 * @memberof URIStringValidator
 * @static
 * @param {*}        possibleURIAuthority
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIAuthority}
 */
URIStringValidator.isURIAuthority = function URIisURIAuthority(
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
  var isValidURIHost = URIStringValidator.isURIHost(possibleURIHost)
  var isValidURIAuthority = false
  var isValidURIPort
  var isValidURIUserInfo
  var possibleURLUserName
  var possibleURLPassword
  var firstUserInfoColonIndex
  var parsedAuthority

  if (isValidURIHost) {
    isValidURIUserInfo =
      possibleURIUserInfo == null || URIStringValidator.isURIUserInfo(possibleURIUserInfo)
    if (possibleURIPort == null && possibleURIPortAndColon === ':') {
      // If the colon exists, then the port is defined, but empty instead of not
      // existing at all.
      possibleURIPort = ''
    }
    isValidURIPort = possibleURIPort == null || URIStringValidator.isURIPort(possibleURIPort)

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
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIFragment
 * @return {Boolean}
 */
URIStringValidator.isURIFragment = function URIisURIFragment(possibleURIFragment) {
  return URIStringValidator.isURIFragmentOrQuery(possibleURIFragment)
}

/**
 * fragment = *( pchar / "/" / "?" )
 * query    = *( pchar / "/" / "?" )
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIFragmentOrQuery
 * @return {Boolean}
 */
URIStringValidator.isURIFragmentOrQuery = function URIisURIFragmentOrQuery(
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
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIHierPart
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIPart}
 */
URIStringValidator.isURIHierPart = function URIisURIHierPart(
  possibleURIHierPart,
  returnParse
) {
  return URIStringValidator.isURIHierPartOrRelativePart(
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
 * @memberof URIStringValidator
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
URIStringValidator.isURIHierPartOrRelativePart = function URIisURIHierPartOrRelativePart(
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
      parsedAuthority = URIStringValidator.isURIAuthority(possibleAuthority, true)
      isValidAuthority = parsedAuthority.isValid
      username = parsedAuthority.username
      password = parsedAuthority.password
      hostname = parsedAuthority.hostname
      port = parsedAuthority.port
    } else {
      isValidAuthority = URIStringValidator.isURIAuthority(possibleAuthority)
    }
    isValidURIPart =
      isValidAuthority && URIStringValidator.isURIPathAbempty(possiblePathAbempty)
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
      if (URIStringValidator.isURIPathAbsolute(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_ABSOLUTE
      } else if (URIStringValidator.isURIPathNoScheme(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_NOSCHEME
      } else if (URIStringValidator.isURIPathEmpty(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_EMPTY
      }
    } else {
      // Default: effectiveType === HIER_PART
      if (URIStringValidator.isURIPathAbsolute(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_ABSOLUTE
      } else if (URIStringValidator.isURIPathRootless(possibleURIPart)) {
        isValidURIPart = true
        partType = PATH_ROOTLESS
      } else if (URIStringValidator.isURIPathEmpty(possibleURIPart)) {
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
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIHost
 * @return {Boolean}
 */
URIStringValidator.isURIHost = function URIisURIHost(possibleURIHost) {
  var isValidURIHost
  if (!Utils.isString(possibleURIHost)) {
    return false
  }
  isValidURIHost =
    URIStringValidator.isURIIPLiteral(possibleURIHost) === true ||
    URIStringValidator.isURIIPv4Address(possibleURIHost) === true ||
    URIStringValidator.isURIRegName(possibleURIHost) === true
  return isValidURIHost
}

/**
 * IP-literal = "[" ( IPv6address / IPvFuture  ) "]"
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIIPLiteral
 * @return {Boolean}
 */
URIStringValidator.isURIIPLiteral = function URIisURIIPLiteral(possibleURIIPLiteral) {
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
  return URIStringValidator.isURIIPv6Address(possibleIP) || URIStringValidator.isURIIPvFuture(possibleIP)
}

/**
 * IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIIPv4Address
 * @return {Boolean}
 */
URIStringValidator.isURIIPv4Address = function URI(possibleURIIPv4Address) {
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
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIIPv6Address
 * @return {Boolean}
 */
URIStringValidator.isURIIPv6Address = function URIisURIIPv6Address(possibleURIIPv6Address) {
  return false
}

/**
 * IPvFuture = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
 *           ; The URI spec calls for HEXDIG to be case-insensitive for
 *             comparison.
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIIPvFuture
 * @return {Boolean}
 */
URIStringValidator.isURIIPvFuture = function URIisURIIPvFuture(possibleURIIPvFuture) {
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
 * Determine if the value is similar to a URI Object by checking the types of
 * individual properties without validating them.
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURILikeObject
 * @return {Boolean}
 */
URIStringValidator.isURILikeObject = function isURILikeObject(possibleURILikeObject) {
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

/**
 * Determine if the value is a URI Object by validating individual properties.
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIObject
 * @return {Boolean}
 */
URIStringValidator.isURIObject = function isURIObject(possibleURIObject) {
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
  isValidAuthorityString = URIStringValidator.isURIAuthority(possibleURIObject.authority)
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
    URIStringValidator.isURIQuery(possibleURIObject.query) || possibleURIObject.query === null

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

/**
 *
 * @memberof URIStringValidator
 * @static
 * @param {*}        possibleURIReference
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIReference}
 */
URIStringValidator.isURIOrRelativeRef = function URIisURIOrRelativeRef(
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
      parsedURIPart = URIStringValidator.isURIHierPartOrRelativePart(
        possibleURIPart,
        RELATIVE_PART,
        true
      )
      isValidURIPart = parsedURIPart.isValid
    } else {
      isValidURIPart = URIStringValidator.isURIHierPartOrRelativePart(
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
    isValidURIScheme = URIStringValidator.isURIScheme(possibleURIScheme)
    if (isParsing === true) {
      parsedURIPart = URIStringValidator.isURIHierPartOrRelativePart(
        possibleURIPart,
        HIER_PART,
        true
      )
      isValidURIPart = parsedURIPart.isValid
    } else {
      isValidURIPart = URIStringValidator.isURIHierPartOrRelativePart(
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
  isValidURIQuery = possibleURIQuery == null || URIStringValidator.isURIQuery(possibleURIQuery)
  if (possibleURIFragment == null && possibleURLHash === '#') {
    // If the number sign exists, then the fragment is defined, but empty
    // instead of not existing at all.
    possibleURIFragment = ''
  }
  isValidURIFragment =
    possibleURIFragment == null || URIStringValidator.isURIFragment(possibleURIFragment)
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
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIPathAbempty
 * @return {Boolean}
 */
URIStringValidator.isURIPathAbempty = function URIisURIPathAbempty(possibleURIPathAbempty) {
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
  pathAbemptyMatches = Utils.unmatchedAsNull(
    possibleURIPathAbempty.match(pathAbemptyRegExp)
  )
  return Utils.hasMatch(pathAbemptyMatches)
}

/**
 * path-absolute = "/" [ segment-nz *( "/" segment ) ]
 *               ; begins with "/" but not "//"
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIPathAbsolute
 * @return {Boolean}
 */
URIStringValidator.isURIPathAbsolute = function URIisURIPathAbsolute(possibleURIPathAbsolute) {
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
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIPathEmpty
 * @return {Boolean}
 */
URIStringValidator.isURIPathEmpty = function URIisURIPathEmpty(possibleURIPathEmpty) {
  return possibleURIPathEmpty === ''
}

/**
 * path-noscheme = segment-nz-nc *( "/" segment )
 *               ; begins with a non-colon segment
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIPathNoScheme
 * @return {Boolean}
 */
URIStringValidator.isURIPathNoScheme = function URIisURIPathNoScheme(possibleURIPathNoScheme) {
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
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIPathRootless
 * @return {Boolean}
 */
URIStringValidator.isURIPathRootless = function URIisURIPathRootless(possibleURIPathRootless) {
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
 * port = *DIGIT
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIPort
 * @return {Boolean}
 */
URIStringValidator.isURIPort = function URIisURIPort(possibleURIPort) {
  var portMatches
  var portRegExp
  if (!Utils.isString(possibleURIPort)) {
    return false
  }
  if (possibleURIPort === '') {
    // URI ports can be zero or more of the defined characters. That makes an
    // empty string a valid value for a port.
    return true
  }
  portRegExp = /^[0-9]*$/
  portMatches = Utils.unmatchedAsNull(possibleURIPort.match(portRegExp))
  return Utils.hasMatch(portMatches)
}

/**
 * query = *( pchar / "/" / "?" )
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIQuery
 * @return {Boolean}
 */
URIStringValidator.isURIQuery = function URIisURIQuery(possibleURIQuery) {
  return URIStringValidator.isURIFragmentOrQuery(possibleURIQuery)
}

/**
 * URI-reference = URI / relative-ref
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIReference
 * @return {Boolean}
 */
URIStringValidator.isURIReference = function URIisURIReference(possibleURIReference) {
  return (
    URIStringValidator.isURI(possibleURIReference) ||
    URIStringValidator.isURIRelativeRef(possibleURIReference)
  )
}

/**
 * reg-name = *( unreserved / pct-encoded / sub-delims )
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIRegName
 * @return {Boolean}
 */
URIStringValidator.isURIRegName = function URIisURIRegName(possibleURIRegName) {
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
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIRelativePart
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIPart}
 */
URIStringValidator.isURIRelativePart = function URIisURIRelativePart(
  possibleURIRelativePart,
  returnParse
) {
  return URIStringValidator.isURIHierPartOrRelativePart(
    possibleURIRelativePart,
    'relative-part',
    returnParse
  )
}

/**
 * relative-ref  = relative-part [ "?" query ] [ "#" fragment ]
 *
 * @memberof URIStringValidator
 * @static
 * @param {*}        possibleURIRelativeRef
 * @param {Boolean}  [returnParse=false]
 *     - If true, an object containing parsed data will be returned. Otherwise a
 *     Boolean is returned.
 * @return {Boolean|URIReference}
 */
URIStringValidator.isURIRelativeRef = function URI(possibleURIRelativeRef, returnParse) {
  return URIStringValidator.isURIOrRelativeRef(
    possibleURIRelativeRef,
    'relative-ref',
    returnParse
  )
}

/**
 * scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIScheme
 * @return {Boolean}
 */
URIStringValidator.isURIScheme = function URIisURIScheme(possibleURIScheme) {
  var schemeMatches
  var schemeRegExp
  if (!Utils.isString(possibleURIScheme)) {
    return false
  }
  schemeRegExp = /^[A-Za-z][A-Za-z0-9+\-.]*$/
  schemeMatches = Utils.unmatchedAsNull(possibleURIScheme.match(schemeRegExp))
  return Utils.hasMatch(schemeMatches)
}

/**
 * userinfo = *( unreserved / pct-encoded / sub-delims / ":" )
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIUserinfo
 * @return {Boolean}
 */
URIStringValidator.isURIUserInfo = function URIisURIUserInfo(possibleURIUserinfo) {
  var userinfoMatches
  var userinfoRegExp
  if (!Utils.isString(possibleURIUserinfo)) {
    return false
  }
  userinfoRegExp = /^(?:(?:%[0-9A-Fa-f][0-9A-Fa-f])|[A-Za-z0-9\-._~!$&'()*+,;=:])*$/
  userinfoMatches = Utils.unmatchedAsNull(
    possibleURIUserinfo.match(userinfoRegExp)
  )
  return Utils.hasMatch(userinfoMatches)
}

/**
 * Parses a URI Reference string and returns it as an object.
 *
 * @memberof URIStringValidator
 * @static
 * @param {*} possibleURIReference
 * @return {ParsedURIReference}
 */
URIStringValidator.parse = function URIparse(possibleURIReference) {
  var authority
  var fragment
  var hash
  var hostname
  var isValid
  var parsedRelativeRef
  var parsedURI

  /**
   * @todo find a way to disambiguate the following variable names currently
   *       known as `parsedURIRef` and `parsedURIReference` and their associated
   *       types
   */
  var parsedURIRef // URIReference
  var parsedURIReference // ParsedURIReference

  var parsedURL
  var partType
  var password
  var path
  var port
  var protocol
  var query
  var scheme
  var search
  var slashes
  var uriType
  var username
  isValid = false
  parsedURIRef = URIStringValidator.isURI(possibleURIReference, true)
  if (parsedURIRef.isValid === true) {
    // COMMON
    isValid = true
    partType = parsedURIRef.partType
    uriType = parsedURIRef.uriType
    slashes = parsedURIRef.slashes

    // URI
    scheme = parsedURIRef.scheme
    authority = parsedURIRef.authority
    path = parsedURIRef.path
    query = parsedURIRef.query
    fragment = parsedURIRef.fragment

    // URL
    protocol = parsedURIRef.protocol
    username = parsedURIRef.username
    password = parsedURIRef.password
    hostname = parsedURIRef.hostname
    port = parsedURIRef.port
    search = parsedURIRef.search
    hash = parsedURIRef.hash
  } else {
    parsedRelativeRef = URIStringValidator.isURIRelativeRef(possibleURIReference, true)
    if (parsedRelativeRef.isValid === true) {
      // COMMON
      isValid = true
      partType = parsedRelativeRef.partType
      uriType = parsedRelativeRef.uriType
      slashes = parsedRelativeRef.slashes

      // URI
      scheme = parsedRelativeRef.scheme
      authority = parsedRelativeRef.authority
      path = parsedRelativeRef.path
      query = parsedRelativeRef.query
      fragment = parsedRelativeRef.fragment

      // URL
      protocol = parsedRelativeRef.protocol
      username = parsedRelativeRef.username
      password = parsedRelativeRef.password
      hostname = parsedRelativeRef.hostname
      port = parsedRelativeRef.port
      search = parsedRelativeRef.search
      hash = parsedRelativeRef.hash
    } else {
      isValid = false
      // partType is undefined
      // uriType is undefined
      slashes = null

      // URI
      scheme = null
      authority = null
      path = null
      query = null
      fragment = null

      // URL
      protocol = null
      username = null
      password = null
      hostname = null
      port = null
      search = null
      hash = null
    }
  }

  /**
   * @type {ParsedURI}
   */
  parsedURI = {
    authority: authority,
    fragment: fragment,
    path: path,
    query: query,
    scheme: scheme,
    slashes: slashes
  }

  /**
   * @type {ParsedURL}
   */
  parsedURL = {
    hash: hash,
    hostname: hostname,
    password: password,
    pathname: path,
    port: port,
    protocol: protocol,
    search: search,
    slashes: slashes,
    username: username
  }

  /**
   * @type {ParsedURIReference}
   */
  parsedURIReference = {
    isValid: isValid,
    partType: partType,
    uri: parsedURI,
    uriType: uriType,
    url: parsedURL
  }

  return parsedURIReference
}

/**
 * Resolve a URI against a base URI.
 *
 * @memberof URIStringValidator
 * @static
 * @throws {TypeError} Will throw a TypeError if either reference or base is not
 *     a valid URI string.
 * @throws {Error} Will throw an Error if reference's path is a relative path as
 *     ability to merge paths and remove dot segments is not yet implemented.
 * @param {String} reference
 *     Reference URI string
 * @param {String} base
 *     The URI string against which the reference URI is resolved.
 * @return {String} A resolved URI
 */
URIStringValidator.resolve = function URIresolve(reference, base) {
  var b // Base URI as a ParsedURI
  var errorMessage
  var parsedReference
  var parsedBase
  var r // Reference URI as a ParsedURI
  var referencePathStartsWithSlash
  var t // Target URI as a ParsedURI
  var target // Target URI as a string
  parsedReference = URIStringValidator.parse(reference)
  if (!parsedReference.isValid) {
    errorMessage = '[URIStringValidator.resolve] `reference` argument is not a valid URI.'
    throw new TypeError(errorMessage)
  }
  parsedBase = URIStringValidator.parse(base)
  if (!parsedBase.isValid) {
    errorMessage = '[URIStringValidator.resolve] `base` argument is not a valid URI.'
    throw new TypeError(errorMessage)
  }
  b = parsedBase.uri
  r = parsedReference.uri

  /**
   * @type {ParsedURI}
   */
  t = {
    authority: null,
    fragment: null,
    path: null,
    query: null,
    scheme: null,
    slashes: null
  }

  // 5.2.2.  Transform References
  if (r.scheme != null) {
    t.scheme = r.scheme
    t.authority = r.authority
    t.path = r.path
    t.query = r.query
  } else {
    if (r.authority != null) {
      t.authority = r.authority
      t.path = r.path
      t.query = r.query
    } else {
      if (r.path === '') {
        t.path = b.path
        if (r.query != null) {
          t.query = r.query
        } else {
          t.query = b.query
        }
      } else {
        referencePathStartsWithSlash = r.path.substr(0, 1) === '/'
        if (referencePathStartsWithSlash) {
          t.path = r.path
        } else {
          /**
           * @todo
           * T.path = merge(Base.path, R.path);
           * T.path = remove_dot_segments(T.path);
           */
          // Until these methods are added, this method will break in this
          // scenario.
          errorMessage =
            '[URIStringValidator.resolve] relative reference paths are not yet supported.'
          throw Error(errorMessage)
        }
        t.query = r.query
      }
      t.authority = b.authority
    }
    t.scheme = b.scheme
  }
  t.fragment = r.fragment
  target = URIStringValidator.uriToString(t)
  return target
}

/**
 * See
 * [RFC3986 Section 5.3]{@link https://tools.ietf.org/html/rfc3986#section-5.3}
 * for additional information.
 *
 * @memberof URIStringValidator
 * @static
 * @throws {ReferenceError}
 *     Will throw a ReferenceError if the `uriObject` is missing
 * @throws {TypeError}
 *     Will throw a TypeError if `uriObject` is not a URI like object.
 * @param {ParsedURI} uriObject
 *     An object representing a parsed URI.
 * @return {String} A URI string.
 */
URIStringValidator.uriToString = function URIuriToString(uriObject) {
  var errorMessage
  var result

  if (typeof uriObject === 'undefined') {
    errorMessage = '[URIStringValidator.uriToString] The `uriObject` argument is undefined.'
    throw new ReferenceError(errorMessage)
  }

  if (URIStringValidator.isURILikeObject(uriObject) !== true) {
    errorMessage =
      '[URIStringValidator.uriToString] The `uriObject` argument is not a URI like object.'
    throw new TypeError(errorMessage)
  }

  // 5.3.  Component Recomposition
  result = ''

  if (uriObject.scheme != null) {
    result += uriObject.scheme
    result += ':'
  }

  if (uriObject.authority != null) {
    result += '//'
    result += uriObject.authority
  }

  result += uriObject.path

  if (uriObject.query != null) {
    result += '?'
    result += uriObject.query
  }

  if (uriObject.fragment != null) {
    result += '#'
    result += uriObject.fragment
  }

  return result
}
