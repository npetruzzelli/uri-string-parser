'use strict'
const chai = require('chai')
const urlTestData = require('./urltestdata/urltestdata')
const wptTestData = require('./urltestdata/convert-wpt-json')
const uriStringParser = require('../lib/index')

const expect = chai.expect
const parseURI = uriStringParser.uri
const parseURL = uriStringParser.url
const testData = [...urlTestData, ...wptTestData]

const FULL_URL = 'http://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash'

describe('uriStringParser', function() {
  it('should parse URIs and URLs as expected', function() {
    testData.forEach(function(urlTestItem) {
      let parsedObject
      let parsedObjectPropertyValue
      let testUriPropertyName
      let testUriPropertyValue
      let testUrlPropertyName
      let testUrlPropertyValue

      parsedObject = uriStringParser(urlTestItem.input)

      // URI
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Enumerability_and_ownership_of_properties
      for (testUriPropertyName in urlTestItem.uri) {
        parsedObjectPropertyValue = parsedObject.uri[testUriPropertyName]
        testUriPropertyValue = urlTestItem.uri[testUriPropertyName]
        if (typeof testUriPropertyValue === 'undefined') {
          expect(parsedObjectPropertyValue).to.be.undefined // eslint-disable-line no-unused-expressions
        } else {
          expect(parsedObjectPropertyValue).to.equal(testUriPropertyValue) // eslint-disable-line no-unused-expressions
        }
      }

      // URL
      for (testUrlPropertyName in urlTestItem.url) {
        parsedObjectPropertyValue = parsedObject.uri[testUrlPropertyName]
        testUrlPropertyValue = urlTestItem.uri[testUrlPropertyName]
        if (typeof testUrlPropertyValue === 'undefined') {
          expect(parsedObjectPropertyValue).to.be.undefined // eslint-disable-line no-unused-expressions
        } else {
          expect(parsedObjectPropertyValue).to.equal(testUrlPropertyValue) // eslint-disable-line no-unused-expressions
        }
      }
    })
  })
  describe('#uri', function() {
    it('should return only the URI portion of the object', function() {
      let uriObject = parseURI(FULL_URL)

      /* eslint-disable no-unused-expressions */
      expect(uriObject.hasOwnProperty('uri')).to.be.false
      expect(uriObject.hasOwnProperty('url')).to.be.false

      expect(uriObject.hasOwnProperty('scheme')).to.be.true
      expect(uriObject.hasOwnProperty('authority')).to.be.true
      expect(uriObject.hasOwnProperty('path')).to.be.true
      expect(uriObject.hasOwnProperty('query')).to.be.true
      expect(uriObject.hasOwnProperty('fragment')).to.be.true

      expect(uriObject.hasOwnProperty('protocol')).to.be.false
      expect(uriObject.hasOwnProperty('slashes')).to.be.false
      expect(uriObject.hasOwnProperty('username')).to.be.false
      expect(uriObject.hasOwnProperty('password')).to.be.false
      expect(uriObject.hasOwnProperty('hostname')).to.be.false
      expect(uriObject.hasOwnProperty('port')).to.be.false
      expect(uriObject.hasOwnProperty('pathname')).to.be.false
      expect(uriObject.hasOwnProperty('search')).to.be.false
      expect(uriObject.hasOwnProperty('hash')).to.be.false
      /* eslint-enable no-unused-expressions */
    })
  })

  describe('#url', function() {
    it('should return only the URL portion of the object', function() {
      let urlObject = parseURL(FULL_URL)

      /* eslint-disable no-unused-expressions */
      expect(urlObject.hasOwnProperty('uri')).to.be.false
      expect(urlObject.hasOwnProperty('url')).to.be.false

      expect(urlObject.hasOwnProperty('scheme')).to.be.false
      expect(urlObject.hasOwnProperty('authority')).to.be.false
      expect(urlObject.hasOwnProperty('path')).to.be.false
      expect(urlObject.hasOwnProperty('query')).to.be.false
      expect(urlObject.hasOwnProperty('fragment')).to.be.false

      expect(urlObject.hasOwnProperty('protocol')).to.be.true
      expect(urlObject.hasOwnProperty('slashes')).to.be.true
      expect(urlObject.hasOwnProperty('username')).to.be.true
      expect(urlObject.hasOwnProperty('password')).to.be.true
      expect(urlObject.hasOwnProperty('hostname')).to.be.true
      expect(urlObject.hasOwnProperty('port')).to.be.true
      expect(urlObject.hasOwnProperty('pathname')).to.be.true
      expect(urlObject.hasOwnProperty('search')).to.be.true
      expect(urlObject.hasOwnProperty('hash')).to.be.true
      /* eslint-enable no-unused-expressions */
    })
  })
})
