'use strict'

// =============================================================================
// Types defined in `URIStringValidator`
// .............................................................................
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
// =============================================================================
// =============================================================================
// Types unique to this module
// .............................................................................
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
// =============================================================================

const URIObjectValidator = require('./uri-object-validator')
const URIStringValidator = require('./uri-string-validator')

/**
 * See
 * [RFC3986 Section 5.3]{@link https://tools.ietf.org/html/rfc3986#section-5.3}
 * for additional information.
 *
 * @throws {ReferenceError}
 *     Will throw a ReferenceError if the `uriObject` is missing
 * @throws {TypeError}
 *     Will throw a TypeError if `uriObject` is not a URI like object.
 * @param {ParsedURI} uriObject
 *     An object representing a parsed URI.
 * @return {String} A URI string.
 */
function formatURIObjectToString(uriObject) {
  var errorMessage
  var result

  if (typeof uriObject === 'undefined') {
    errorMessage =
      '[formatURIObjectToString] The `uriObject` argument is undefined.'
    throw new ReferenceError(errorMessage)
  }

  if (URIObjectValidator.isURILikeObject(uriObject) !== true) {
    errorMessage =
      '[formatURIObjectToString] The `uriObject` argument is not a URI like object.'
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

// function formatURLObjectToString() {}

// function mergePaths() {}

/**
 * Parses a URI Reference string and returns it as an object.
 *
 * @param {*} possibleURIReference
 * @return {ParsedURIReference}
 */
function parseURIString(possibleURIReference) {
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
    parsedRelativeRef = URIStringValidator.isURIRelativeRef(
      possibleURIReference,
      true
    )
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

// function removeDotSegments() {}

/**
 * Resolve a URI against a base URI.
 *
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
function resolveURIString(reference, base) {
  var b // Base URI as a ParsedURI
  var errorMessage
  var parsedReference
  var parsedBase
  var r // Reference URI as a ParsedURI
  var referencePathStartsWithSlash
  var t // Target URI as a ParsedURI
  var target // Target URI as a string
  parsedReference = parseURIString(reference)
  if (!parsedReference.isValid) {
    errorMessage =
      '[URIStringValidator.resolve] `reference` argument is not a valid URI.'
    throw new TypeError(errorMessage)
  }
  parsedBase = parseURIString(base)
  if (!parsedBase.isValid) {
    errorMessage =
      '[URIStringValidator.resolve] `base` argument is not a valid URI.'
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
  target = formatURIObjectToString(t)
  return target
}

const defaultExport = {
  // mergePaths: mergePaths,
  parse: parseURIString,
  // removeDotSegments: removeDotSegments,
  resolve: resolveURIString,
  uriToString: formatURIObjectToString,
  // urlToString: formatURLObjectToString,
  validate: {
    object: URIObjectValidator,
    string: URIStringValidator
  }
}

module.exports = defaultExport
