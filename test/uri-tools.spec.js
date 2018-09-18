'use strict'
const chai = require('chai')
const URITools = require('../lib/uri-tools')
const expect = chai.expect

const AUTHORITY_PATH_ABEMPTY = 'authority-path-abempty'
// const PATH_ABEMPTY = 'path-abempty'
const PATH_ABSOLUTE = 'path-absolute'
const PATH_EMPTY = 'path-empty'
const PATH_NOSCHEME = 'path-noscheme'
const PATH_ROOTLESS = 'path-rootless'
const RELATIVE_REF = 'relative-ref'
const URI = 'uri'

describe('URITools()', function() {
  describe('#parse(possibleURIReference)', function() {
    it('should correctly parse an `authority-path-abempty` uri.', function() {
      var input = 'http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash'
      var parsedInput = URITools.parse(input)

      /* eslint-disable no-unused-expressions */
      // TYPES
      expect(parsedInput).to.be.an('object')
      expect(parsedInput.uri).to.be.an('object')
      expect(parsedInput.url).to.be.an('object')

      // COMMON
      expect(parsedInput.isValid).to.be.true
      expect(parsedInput.uriType).to.equal(URI)
      expect(parsedInput.partType).to.equal(AUTHORITY_PATH_ABEMPTY)

      // URI
      expect(parsedInput.uri.scheme).to.equal('http')
      expect(parsedInput.uri.slashes).to.equal('//')
      expect(parsedInput.uri.authority).to.equal('user:pass@sub.host.com:8080')
      expect(parsedInput.uri.path).to.equal('/p/a/t/h')
      expect(parsedInput.uri.query).to.equal('query=string')
      expect(parsedInput.uri.fragment).to.equal('hash')

      // URL
      expect(parsedInput.url.protocol).to.equal('http:')
      expect(parsedInput.url.slashes).to.equal('//')
      expect(parsedInput.url.username).to.equal('user')
      expect(parsedInput.url.password).to.equal('pass')
      expect(parsedInput.url.hostname).to.equal('sub.host.com')
      expect(parsedInput.url.port).to.equal('8080')
      expect(parsedInput.url.pathname).to.equal('/p/a/t/h')
      expect(parsedInput.url.search).to.equal('?query=string')
      expect(parsedInput.url.hash).to.equal('#hash')
      /* eslint-enable no-unused-expressions */
    })
    it('should correctly parse a `path-absolute` uri.', function() {
      var input = 'http:/p/a/t/h?query=string#hash'
      var parsedInput = URITools.parse(input)

      /* eslint-disable no-unused-expressions */
      // TYPES
      expect(parsedInput).to.be.an('object')
      expect(parsedInput.uri).to.be.an('object')
      expect(parsedInput.url).to.be.an('object')

      // COMMON
      expect(parsedInput.isValid).to.be.true
      expect(parsedInput.uriType).to.equal(URI)
      expect(parsedInput.partType).to.equal(PATH_ABSOLUTE)

      // URI
      expect(parsedInput.uri.scheme).to.equal('http')
      expect(parsedInput.uri.slashes).to.be.null
      expect(parsedInput.uri.authority).to.be.null
      expect(parsedInput.uri.path).to.equal('/p/a/t/h')
      expect(parsedInput.uri.query).to.equal('query=string')
      expect(parsedInput.uri.fragment).to.equal('hash')

      // URL
      expect(parsedInput.url.protocol).to.equal('http:')
      expect(parsedInput.url.slashes).to.be.null
      expect(parsedInput.url.username).to.be.null
      expect(parsedInput.url.password).to.be.null
      expect(parsedInput.url.hostname).to.be.null
      expect(parsedInput.url.port).to.be.null
      expect(parsedInput.url.pathname).to.equal('/p/a/t/h')
      expect(parsedInput.url.search).to.equal('?query=string')
      expect(parsedInput.url.hash).to.equal('#hash')
      /* eslint-enable no-unused-expressions */
    })
    it('should correctly parse a `path-rootless` uri.', function() {
      var input = 'http:p/a/t/h?query=string#hash'
      var parsedInput = URITools.parse(input)

      /* eslint-disable no-unused-expressions */
      // TYPES
      expect(parsedInput).to.be.an('object')
      expect(parsedInput.uri).to.be.an('object')
      expect(parsedInput.url).to.be.an('object')

      // COMMON
      expect(parsedInput.isValid).to.be.true
      expect(parsedInput.uriType).to.equal(URI)
      expect(parsedInput.partType).to.equal(PATH_ROOTLESS)

      // URI
      expect(parsedInput.uri.scheme).to.equal('http')
      expect(parsedInput.uri.slashes).to.be.null
      expect(parsedInput.uri.authority).to.be.null
      expect(parsedInput.uri.path).to.equal('p/a/t/h')
      expect(parsedInput.uri.query).to.equal('query=string')
      expect(parsedInput.uri.fragment).to.equal('hash')

      // URL
      expect(parsedInput.url.protocol).to.equal('http:')
      expect(parsedInput.url.slashes).to.be.null
      expect(parsedInput.url.username).to.be.null
      expect(parsedInput.url.password).to.be.null
      expect(parsedInput.url.hostname).to.be.null
      expect(parsedInput.url.port).to.be.null
      expect(parsedInput.url.pathname).to.equal('p/a/t/h')
      expect(parsedInput.url.search).to.equal('?query=string')
      expect(parsedInput.url.hash).to.equal('#hash')
      /* eslint-enable no-unused-expressions */
    })
    it('should correctly parse an `path-empty` uri.', function() {
      var input = 'http:?query=string#hash'
      var parsedInput = URITools.parse(input)

      /* eslint-disable no-unused-expressions */
      // TYPES
      expect(parsedInput).to.be.an('object')
      expect(parsedInput.uri).to.be.an('object')
      expect(parsedInput.url).to.be.an('object')

      // COMMON
      expect(parsedInput.isValid).to.be.true
      expect(parsedInput.uriType).to.equal(URI)
      expect(parsedInput.partType).to.equal(PATH_EMPTY)

      // URI
      expect(parsedInput.uri.scheme).to.equal('http')
      expect(parsedInput.uri.slashes).to.be.null
      expect(parsedInput.uri.authority).to.be.null
      expect(parsedInput.uri.path).to.equal('')
      expect(parsedInput.uri.query).to.equal('query=string')
      expect(parsedInput.uri.fragment).to.equal('hash')

      // URL
      expect(parsedInput.url.protocol).to.equal('http:')
      expect(parsedInput.url.slashes).to.be.null
      expect(parsedInput.url.username).to.be.null
      expect(parsedInput.url.password).to.be.null
      expect(parsedInput.url.hostname).to.be.null
      expect(parsedInput.url.port).to.be.null
      expect(parsedInput.url.pathname).to.equal('')
      expect(parsedInput.url.search).to.equal('?query=string')
      expect(parsedInput.url.hash).to.equal('#hash')
      /* eslint-enable no-unused-expressions */
    })
    it('should correctly parse an `authority-path-abempty` relative-ref.', function() {
      var input = '//user:pass@sub.host.com:8080/p/a/t/h?query=string#hash'
      var parsedInput = URITools.parse(input)

      /* eslint-disable no-unused-expressions */
      // TYPES
      expect(parsedInput).to.be.an('object')
      expect(parsedInput.uri).to.be.an('object')
      expect(parsedInput.url).to.be.an('object')

      // COMMON
      expect(parsedInput.isValid).to.be.true
      expect(parsedInput.uriType).to.equal(RELATIVE_REF)
      expect(parsedInput.partType).to.equal(AUTHORITY_PATH_ABEMPTY)

      // URI
      expect(parsedInput.uri.scheme).to.be.null
      expect(parsedInput.uri.slashes).to.equal('//')
      expect(parsedInput.uri.authority).to.equal('user:pass@sub.host.com:8080')
      expect(parsedInput.uri.path).to.equal('/p/a/t/h')
      expect(parsedInput.uri.query).to.equal('query=string')
      expect(parsedInput.uri.fragment).to.equal('hash')

      // URL
      expect(parsedInput.url.protocol).to.be.null
      expect(parsedInput.url.slashes).to.equal('//')
      expect(parsedInput.url.username).to.equal('user')
      expect(parsedInput.url.password).to.equal('pass')
      expect(parsedInput.url.hostname).to.equal('sub.host.com')
      expect(parsedInput.url.port).to.equal('8080')
      expect(parsedInput.url.pathname).to.equal('/p/a/t/h')
      expect(parsedInput.url.search).to.equal('?query=string')
      expect(parsedInput.url.hash).to.equal('#hash')
      /* eslint-enable no-unused-expressions */
    })
    it('should correctly parse an `path-absolute` relative-ref.', function() {
      var input = '/p/a/t/h?query=string#hash'
      var parsedInput = URITools.parse(input)

      /* eslint-disable no-unused-expressions */
      // TYPES
      expect(parsedInput).to.be.an('object')
      expect(parsedInput.uri).to.be.an('object')
      expect(parsedInput.url).to.be.an('object')

      // COMMON
      expect(parsedInput.isValid).to.be.true
      expect(parsedInput.uriType).to.equal(RELATIVE_REF)
      expect(parsedInput.partType).to.equal(PATH_ABSOLUTE)

      // URI
      expect(parsedInput.uri.scheme).to.be.null
      expect(parsedInput.uri.slashes).to.be.null
      expect(parsedInput.uri.authority).to.be.null
      expect(parsedInput.uri.path).to.equal('/p/a/t/h')
      expect(parsedInput.uri.query).to.equal('query=string')
      expect(parsedInput.uri.fragment).to.equal('hash')

      // URL
      expect(parsedInput.url.protocol).to.be.null
      expect(parsedInput.url.slashes).to.be.null
      expect(parsedInput.url.username).to.be.null
      expect(parsedInput.url.password).to.be.null
      expect(parsedInput.url.hostname).to.be.null
      expect(parsedInput.url.port).to.be.null
      expect(parsedInput.url.pathname).to.equal('/p/a/t/h')
      expect(parsedInput.url.search).to.equal('?query=string')
      expect(parsedInput.url.hash).to.equal('#hash')
      /* eslint-enable no-unused-expressions */
    })
    it('should correctly parse an `path-noscheme` relative-ref.', function() {
      var input = 'p/a/t/h?query=string#hash'
      var parsedInput = URITools.parse(input)

      /* eslint-disable no-unused-expressions */
      // TYPES
      expect(parsedInput).to.be.an('object')
      expect(parsedInput.uri).to.be.an('object')
      expect(parsedInput.url).to.be.an('object')

      // COMMON
      expect(parsedInput.isValid).to.be.true
      expect(parsedInput.uriType).to.equal(RELATIVE_REF)
      expect(parsedInput.partType).to.equal(PATH_NOSCHEME)

      // URI
      expect(parsedInput.uri.scheme).to.be.null
      expect(parsedInput.uri.slashes).to.be.null
      expect(parsedInput.uri.authority).to.be.null
      expect(parsedInput.uri.path).to.equal('p/a/t/h')
      expect(parsedInput.uri.query).to.equal('query=string')
      expect(parsedInput.uri.fragment).to.equal('hash')

      // URL
      expect(parsedInput.url.protocol).to.be.null
      expect(parsedInput.url.slashes).to.be.null
      expect(parsedInput.url.username).to.be.null
      expect(parsedInput.url.password).to.be.null
      expect(parsedInput.url.hostname).to.be.null
      expect(parsedInput.url.port).to.be.null
      expect(parsedInput.url.pathname).to.equal('p/a/t/h')
      expect(parsedInput.url.search).to.equal('?query=string')
      expect(parsedInput.url.hash).to.equal('#hash')
      /* eslint-enable no-unused-expressions */
    })
    it('should correctly parse an `path-empty` relative-ref.', function() {
      var input = '?query=string#hash'
      var parsedInput = URITools.parse(input)

      /* eslint-disable no-unused-expressions */
      // TYPES
      expect(parsedInput).to.be.an('object')
      expect(parsedInput.uri).to.be.an('object')
      expect(parsedInput.url).to.be.an('object')

      // COMMON
      expect(parsedInput.isValid).to.be.true
      expect(parsedInput.uriType).to.equal(RELATIVE_REF)
      expect(parsedInput.partType).to.equal(PATH_EMPTY)

      // URI
      expect(parsedInput.uri.scheme).to.be.null
      expect(parsedInput.uri.slashes).to.be.null
      expect(parsedInput.uri.authority).to.be.null
      expect(parsedInput.uri.path).to.equal('')
      expect(parsedInput.uri.query).to.equal('query=string')
      expect(parsedInput.uri.fragment).to.equal('hash')

      // URL
      expect(parsedInput.url.protocol).to.be.null
      expect(parsedInput.url.slashes).to.be.null
      expect(parsedInput.url.username).to.be.null
      expect(parsedInput.url.password).to.be.null
      expect(parsedInput.url.hostname).to.be.null
      expect(parsedInput.url.port).to.be.null
      expect(parsedInput.url.pathname).to.equal('')
      expect(parsedInput.url.search).to.equal('?query=string')
      expect(parsedInput.url.hash).to.equal('#hash')
      /* eslint-enable no-unused-expressions */
    })
    /**
     * @todo Comment on abbreviated URIs that include a colon in the authority.
     * @todo Comment on abbreviated URIs that don't include a colon in the
     *       authority.
     */
  })
  describe('#resolve(reference, base)', function() {
    it('should eventually have tests defined.')
  })
  describe('#uriToString(uriObject)', function() {
    it('should eventually have tests defined.')
  })
})
