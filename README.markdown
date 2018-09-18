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

var parsedURI1 = uriStringParser('http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');
/* =>
{
  uri: {
    scheme: 'http',
    slashes: '//',
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
*/

var parsedURI2 = uriStringParser('#hash');
/* =>
{
  uri: {
    scheme: null,
    slashes: null,
    authority: null,
    path: null,
    query: null,
    fragment: 'hash'
  },
  url: {
    protocol: null,
    slashes: null,
    username: null,
    password: null,
    hostname: null,
    port: null,
    pathname: null,
    search: null,
    hash: '#hash'
  }
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

#### Abbreviated URLs

Abbreviated URLs (absolute URLs that don't have schemes or slashes) are not
supported.

Abbreviated URLs are not handled by the URI Standard.

-   **Supported:** `https://www.google.com`
-   **NOT Supported:** `www.google.com`

## API

### uriStringParser(uri)

Returns a plain object containing a parsed URI. _Parts of the URI not found
during parsing will be `null`._

#### uri

-   Type: `String`

The URI to be parsed.

## RESOURCES

-   [About this module]( docs/about.markdown )
-   [CONTRIBUTING]( CONTRIBUTING.markdown )
-   [LICENSE]( LICENSE )
