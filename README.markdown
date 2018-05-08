# uri-string-parser

_Uniform Resource Identifier String Parser_

A non-destructive parser for URI and URL strings.

## Installation

```
npm install --save uri-string-parser
```

## Basic Usage

Basic usage without any options is the same as passing the string through a
regular expression and then further parsing the authority to get the user
information, hostname, and port.

**Basic Usage 1**
```javascript
const uriStringParser = require('uri-string-parser')

var parsedURI = uriStringParser('http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash')

// is the same as:

var parsedURI = {
  uri: {
    scheme: 'http',
    authority: 'user:pass@sub.host.com:8080',
    path: '/p/a/t/h',
    query: 'query=string',
    fragment: 'hash'
  },
  url: {
    protocol: 'http:',
    slashes: '//',
    username: 'user',
    password: 'pass',
    hostname: 'sub.host.com',
    port: '8080',
    pathname: '/p/a/t/h',
    search: '?query=string',
    hash: '#hash'
  }
}
```

**Basic Usage 2**
```javascript
const uriStringParser = require('uri-string-parser');

const uris = [
  // A Full URL
  'http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash',

  // A protocol relative URL (aka. network-path reference)
  '//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',

  // A root relative URL (aka. absolute-path reference)
  '/assets/scripts/main.js',

  // Relative URLs (aka. relative-path reference)
  './assets/styles/main.css',
  '../fonts/open-sans.ttf',

  // * This parses correctly when the `assumeSchemeHasSlashes` option is NOT
  //   enabled.
  'images/logo.png',

  // URLs lacking a protocol
  // * Without advanced options, this won't be parsed properly.
  'www.google.com/search?q=cat+pictures',

  // URLs that don't use slashes
  // * Without advanced options, `no-reply@host.com` is considered a part of the
  //   path, not the authority. This may or may not be correct, depending on the
  //   protocol.
  'mailto:no-reply@host.com',

  // Invalid URL; Has protocol, has password, but no username
  // * Despite being invalid, it is parsed correctly.
  'http://:pass@sub.host.com:8080/p/a/t/h?query=string#hash',

  // Invalid URL; No protocol, has password, but no username
  // * Suffers the same problems as URLs lacking a protocol.
  ':pass@sub.host.com:8080/p/a/t/h?query=string#hash',

  // Invalid URL; A non-numeric port
  // * Without `assumeSchemeHasSlashes`, `www.google.com:` becomes the protocol
  //   and `foo` is considered a part of the path.
  'www.google.com:foo/p/a/t/h'
];

uris.forEach(function(uri) {
  var obj = uriStringParser.url(uri); // No Options!
  console.log(uri);
  console.log(JSON.stringify(obj, null, 2));
  console.log('');
});

/* CONSOLE OUTPUT =>
http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash
{
  "protocol": "http:",
  "slashes": "//",
  "username": "user",
  "password": "pass",
  "hostname": "sub.host.com",
  "port": "8080",
  "pathname": "/p/a/t/h",
  "search": "?query=string",
  "hash": "#hash"
}

//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
{
  "slashes": "//",
  "hostname": "ajax.googleapis.com",
  "pathname": "/ajax/libs/jquery/3.3.1/jquery.min.js"
}

/assets/scripts/main.js
{
  "pathname": "/assets/scripts/main.js"
}

./assets/styles/main.css
{
  "pathname": "./assets/styles/main.css"
}

../fonts/open-sans.ttf
{
  "pathname": "../fonts/open-sans.ttf"
}

images/logo.png
{
  "pathname": "images/logo.png"
}

www.google.com/search?q=cat+pictures
{
  "pathname": "www.google.com/search",
  "search": "?q=cat+pictures"
}

mailto:no-reply@host.com
{
  "protocol": "mailto:",
  "pathname": "no-reply@host.com"
}

:pass@sub.host.com:8080/p/a/t/h?query=string#hash
{
  "pathname": ":pass@sub.host.com:8080/p/a/t/h",
  "search": "?query=string",
  "hash": "#hash"
}

www.google.com:foo/p/a/t/h
{
  "protocol": "www.google.com:",
  "pathname": "foo/p/a/t/h"
}
*/
```

## Advanced Usage:

**When to use advanced options:**

If you expect to be handling:

-   URLs that have an authority, but no scheme.
-   Schemes that have an authority, but don't use double slashes
-   You have a need to try to parse otherwise invalid URLs

then use advanced options, **otherwise, don't use advanced options!** You will
be making more work for yourself with relative paths!

Enabling slash assumptions allows resources lacking a scheme to be parsed
correctly, but it creates problems for protocols that don't use two forward
slashes (`//`). To get around this, all you have to do is identify expected
schemes that you know will not be using slashes.

Each known scheme can be configured to allow assumptions or extract authority
sections where it otherwise might not. By default, additional processing is
turned off for known schemes. This allows assumptions to properly handle
relative paths while a known scheme can be processed by the regular expression
directly.

```javascript
const uriStringParser = require('uri-string-parser');

const uris = [
  // A Full URL
  'http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash',

  // A protocol relative URL (aka. network-path reference)
  '//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',

  // A root relative URL (aka. absolute-path reference)
  '/assets/scripts/main.js',

  // Relative URLs (aka. relative-path reference)
  './assets/styles/main.css',
  '../fonts/open-sans.ttf',

  // Caveat: when assumptions are enabled, this relative URL isn't parsed
  // properly, despite being valid. To work around this limitation, ensure that
  // paths relative to the current directory start with `./`.
  'images/logo.png',

  // URLs lacking a protocol
  'www.google.com/search?q=cat+pictures',

  // URLs that don't use slashes
  'mailto:no-reply@host.com',

  // Invalid URL; Has password, but no username
  ':pass@sub.host.com:8080/p/a/t/h?query=string#hash',

  // Invalid URL; A non-numeric port is not a port, so it remains a part of the
  // hostname.
  'www.google.com:foo/p/a/t/h'
];

const parserOptions = {
  assumeSchemeHasSlashes: true,
  knownSchemes: [
    'mailto'
  ]
};

uris.forEach(function(uri) {
  var obj = uriStringParser.url(uri, options);
  console.log(uri);
  console.log(JSON.stringify(obj, null, 2));
  console.log('');
});

/* CONSOLE OUTPUT =>
http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash
{
  "protocol": "http:",
  "slashes": "//",
  "username": "user",
  "password": "pass",
  "hostname": "sub.host.com",
  "port": "8080",
  "pathname": "/p/a/t/h",
  "search": "?query=string",
  "hash": "#hash"
}

//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
{
  "slashes": "//",
  "hostname": "ajax.googleapis.com",
  "pathname": "/ajax/libs/jquery/3.3.1/jquery.min.js"
}

/assets/scripts/main.js
{
  "pathname": "/assets/scripts/main.js"
}

./assets/styles/main.css
{
  "pathname": "./assets/styles/main.css"
}

../fonts/open-sans.ttf
{
  "pathname": "../fonts/open-sans.ttf"
}

images/logo.png
{
  "hostname": "images",
  "pathname": "/logo.png"
}

www.google.com/search?q=cat+pictures
{
  "hostname": "www.google.com",
  "pathname": "/search",
  "search": "?q=cat+pictures"
}

mailto:no-reply@host.com
{
  "protocol": "mailto:",
  "pathname": "no-reply@host.com"
}

:pass@sub.host.com:8080/p/a/t/h?query=string#hash
{
  "password": "pass",
  "hostname": "sub.host.com",
  "port": "8080",
  "pathname": "/p/a/t/h",
  "search": "?query=string",
  "hash": "#hash"
}

www.google.com:foo/p/a/t/h
{
  "hostname": "www.google.com:foo",
  "pathname": "/p/a/t/h"
}
*/
```

### Notes

-   **uri.path** is identical to **url.pathname**
-   **uri.scheme** is the same thing as a **url.protocol**, but without the
    trailing **:**
    -   `scheme = 'http'`
    -   `protocol = 'http:'`
-   **uri.query** is the same thing as a **url.search**, but without the leading
    **?**
    -   `query = 'lookup=dogs'`
    -   `search = '?lookup=dogs'`
-   **uri.fragment** is the same thing as a **url.hash**, but without the
    leading **#**
    -   `fragment = 'myhash'`
    -   `hash = '#myhash'`

## API

### uriStringParser(uri[, options])

Returns a plain object containing a parsed URI. _Parts of the URI not found
during parsing will not be defined._

#### uri

-   Type: `String`

The URI to be parsed.

#### options

-   Optional
-   Type: `Object`

##### options.assumeSchemeHasSlashes

-   Optional
-   Type: `Boolean`
-   Default: `false`

When true, the code makes some assumptions about the URI passed to it. If it
doesn't find a protocol that uses two slashes, it will prepend `//` to the
string before processing it. After processing, it will remove slashes from the
object before returning it.

This will improve accuracy for input URIs that don't have protocols,
**but it will cause URIs that have protocols that don't use double slashes to be
handled incorrectly**, such as `mailto:`. Absolute URIs that already have two
slashes will be unaffected.

While the processing may be more accurate, no validation occurs. It isn't able
to fix invalid URIs.

For example:

```javascript
const uriStringParser = require('uri-string-parser')

var uriWithUserinfo = 'user:pass@sub.host.com:8080/p/a/t/h?query=string#hash'
var actualResult = uriStringParser.uri(uriWithUserinfo)
var expectedResult = uriStringParser.uri(
  uriWithUserinfo, 
  { assumeSchemeHasSlashes: true }
)

// actualResult
// Authority is undefined, scheme and path are incorrect.
{
  scheme: 'user',
  path: 'pass@sub.host.com:8080/p/a/t/h',
  query: 'query=string',
  fragment: 'hash'
}

// expectedResult
// Scheme is undefined. Authority and path have expected values.
{
  authority: 'user:pass@sub.host.com:8080',
  path: '/p/a/t/h',
  query: 'query=string',
  fragment: 'hash'
}

```
```javascript
const uriStringParser = require('uri-string-parser')

var uriWithPort = 'sub.host.com:8080/p/a/t/h?query=string#hash'
var actualResult2 = uriStringParser.uri(uriWithPort)
var expectedResult2 = uriStringParser.uri(uriWithPort, { assumeSchemeHasSlashes: true })

// actualResult2
// Authority is undefined, scheme and path are incorrect.
{
  scheme: 'sub.host.com',
  path: '8080/p/a/t/h',
  query: 'query=string',
  fragment: 'hash'
}

// expectedResult2
// Scheme is undefined. Authority and path have expected values.
{
  authority: 'user:pass@sub.host.com:8080',
  path: '/p/a/t/h',
  query: 'query=string',
  fragment: 'hash'
}

```
```javascript
const uriStringParser = require('uri-string-parser')

var uriWithHostOnly = 'sub.host.com/p/a/t/h?query=string#hash'
var actualResult3 = uriStringParser.uri(uriWithHostOnly)
var expectedResult3 = uriStringParser.uri(uriWithHostOnly, { assumeSchemeHasSlashes: true })

// actualResult3
// Authority is undefined. Path is incorrect. Scheme is (correctly) undefined.
{
  path: 'sub.host.com/p/a/t/h',
  query: 'query=string',
  fragment: 'hash'
}

// expectedResult3
// Scheme is undefined. Authority and path have expected values.
{
  authority: 'sub.host.com',
  path: '/p/a/t/h',
  query: 'query=string',
  fragment: 'hash'
}
```

###### KNOWN LIMITATIONS OF ASSUMPTIONS

When assumptions are enabled, relative URLs that don't start with a current
directory indicator (`./`) or parent directory indicator (`../`) aren't parsed
properly, despite being valid.

To work around this limitation, ensure that paths relative to the current
directory start with `./`. Use `./assets/images/logo.png` instead of 
`assets/images/logo.png`.

##### options.knownSchemes

-   Type: `Array` of `Strings`
-   Default: `[]`

The regular expression provided by RFC3986 captures protocols that don't use
double slashes inaccurately _when `assumeSchemeHasSlashes` is enabled._ 

It is normal for protocols not using double slashes to not have an authority
captured separately from the path. Depending on your protocol, this may or may
not be intentional.

The `assumeSchemeHasSlashes` option can't handle this alone as it works under
the assumption that the input URI doesn't have any protocol information. To get
around this, we can provide a list of known schemes to modify the URI during
internal processing. As with `assumeSchemeHasSlashes`, these internal
modifications are non-destructive and are removed before the final object is
returned.

```javascript
const uriStringParser = require('uri-string-parser')

var uriWithSlashlessProtocol = 'someprotocol:user:pass@sub.host.com:8080/p/a/t/h?query=string#hash'
var actualResult = uriStringParser.uri(
  uriWithSlashlessProtocol,
  {
    assumeSchemeHasSlashes: true,
    knownSchemes: ['someprotocol'],
  }
)
var incorrectAssumptionResult = uriStringParser.uri(
  uriWithSlashlessProtocol,
  {
    assumeSchemeHasSlashes: true
  }
)
var expectedResult = uriStringParser.uri(
  uriWithSlashlessProtocol,
  {
    assumeSchemeHasSlashes: true,
    knownSchemes: ['someprotocol'],
    knownSchemesOptions: {
      'someprotocol': { parseSlashlessAuthority: true }
    }
  }
)

// actualResult
// Authority is undefined and path includes the "authority", which may or may
// not be correct depending on the protocol.
{
  scheme: 'someprotocol',
  path: 'use:pass@sub.host.com:8080/p/a/t/h',
  query: 'query=string',
  fragment: 'hash'
}

// incorrectAssumptionResult
// Scheme is undefined. The protocol is included in the authority.
// Our assumptions just made things worse!
{
  authority: 'someprotocol:user:pass@sub.host.com:8080',
  path: '/p/a/t/h',
  query: 'query=string',
  fragment: 'hash'
}

// expectedResult
// Scheme is correct. Authority and path have expected values.
// Whether or not authority should be undefined or prepended to path may depend
// on the protocol. This module separates them reliably and they can be 
// concatenated reliably based on the scheme later.
{
  scheme: 'someprotocol',
  authority: 'user:pass@sub.host.com:8080',
  path: '/p/a/t/h',
  query: 'query=string',
  fragment: 'hash'
}
```

##### options.knownSchemesOptions

-   Optional
-   Type: `Object`
-   Default: `{}`
-   _Note: both "schemes" and "options" are plural._

This object uses a scheme supplied to `knownSchemes` as its keys and its values
are plain objects that hold options for greater control over how known schemes
are handled.

###### options.knownSchemesOptions.assumptionsAllowed

-   Optional
-   Type: `Boolean`
-   Default: `false`

If a known protocol is identified, setting this to true allows additional
handling when `options.assumeSchemeHasSlashes = true`.

In many cases, this is not what is desired, so it is `false` by default for
known schemes only. The `options.knownSchemesOptions.parseSlashlessAuthority`
option is more likely to be what you are looking for.

###### options.knownSchemesOptions.parseSlashlessAuthority

-   Optional
-   Type: `Boolean`
-   Default: `false`

Normally, when two slashes don't follow the protocol, what could be considered
the authority is included as a part of the path.

Setting this option to `true` will added double slashes after the protocol
internally to allow for the authority to be separated from the path. As with
`options.assumeSchemeHasSlashes`, these slashes are removed from the url object
before it is finally returned.

### uriStringParser.uri(uri[, options])

Accepts the same arguments as `uriStringParser`, but returns just the URI
portion of the object.

### uriStringParser.url(uri[, options])

Accepts the same arguments as `uriStringParser`, but returns just the URL
portion of the object.

## RESOURCES

-   [About this module]( docs/about.markdown )
-   [CONTRIBUTING]( CONTRIBUTING.markdown )
-   [LICENSE]( LICENSE )
