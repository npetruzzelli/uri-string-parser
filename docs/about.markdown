# About this Package

## What is it?

**uri-string-parser** is a module that parses a URI string into an object representing its
parts. It is non-destructive, meaning that none of the characters from the input
are transformed in the output.

### Why? Hasn't this been done before?

There are a large number of other packages that take on parsing a URL, just
about all of them go beyond that and go on to transform or validate the string
or provide some other kind of capability.

This module just parses the string into an object. Thats it. It attempts to
break up the string the same way a person might. 

### Why not the URL class?

The [URL class]( https://url.spec.whatwg.org/ ) provided by 
[node]( https://nodejs.org/api/url.html ) and as is available in 
[web browsers]( https://developer.mozilla.org/en-US/docs/Web/API/URL ) only
supports well formed, absolute URLs. It provides some validation and throws an
exception on critical errors. Various transformations to the string will also 
happen under the hood (such as percent encoding, removing the port if it
matches the default for its protocol, etc.)

This module aims to work with:

-   absolute URIs
-   relative paths
    -   protocol relative paths, also known as "network-path reference"
    -   root relative paths, also known as "absolute-path reference"
    -   file relative paths, also known as "relative-path reference"

without transforming the contents of the string (beyond breaking it up) and
without creating any new data (origin) or duplication of data (host vs. 
hostname and port).

### How?

This module builds upon ABNF definitions found in in IETF RFC3986. 

Unlike the regular expression found in Appendix B of IETF RFC3986, this module
is built to be a validating parser. See:
[Uniform Resource Identifier (URI): Generic Syntax]( https://tools.ietf.org/html/rfc3986 )
