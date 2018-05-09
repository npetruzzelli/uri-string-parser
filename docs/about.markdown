# About this Package

## What is it?

**uri-string-parser** is a module that parses a URI string into an object representing its
parts. It is non-destructive, meaning that non of the characters from the input
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

This module builds upon the regular expression found in IETF RFC3986:
[Uniform Resource Identifier (URI): Generic Syntax]( https://tools.ietf.org/html/rfc3986 )

```
Appendix B.  Parsing a URI Reference with a Regular Expression

   As the "first-match-wins" algorithm is identical to the "greedy"
   disambiguation method used by POSIX regular expressions, it is
   natural and commonplace to use a regular expression for parsing the
   potential five components of a URI reference.

   The following line is the regular expression for breaking-down a
   well-formed URI reference into its components.

      ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
       12            3  4          5       6  7        8 9

   The numbers in the second line above are only to assist readability;
   they indicate the reference points for each subexpression (i.e., each
   paired parenthesis).  We refer to the value matched for subexpression
   <n> as $<n>.  For example, matching the above expression to

      http://www.ics.uci.edu/pub/ietf/uri/#Related

   results in the following subexpression matches:

      $1 = http:
      $2 = http
      $3 = //www.ics.uci.edu
      $4 = www.ics.uci.edu
      $5 = /pub/ietf/uri/
      $6 = <undefined>
      $7 = <undefined>
      $8 = #Related
      $9 = Related

   where <undefined> indicates that the component is not present, as is
   the case for the query component in the above example.  Therefore, we
   can determine the value of the five components as

      scheme    = $2
      authority = $4
      path      = $5
      query     = $7
      fragment  = $9
```

From there additional parsing is performed on the authority to break it up into
its respective pieces. Options have been put in place to allow the module to
make some assumptions about the protocol, helping to prevent the breakdown of
the regular expression with some incomplete URI scenarios.
