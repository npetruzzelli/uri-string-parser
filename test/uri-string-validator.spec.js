'use strict'
const chai = require('chai')
const URIStringValidator = require('../lib/uri-string-validator')
const expect = chai.expect

describe('URIStringValidator()', function() {
  describe('#isAbsoluteURI(possibleAbsoluteURI, returnParse)', function() {
    // .........................................................................
  })
  describe('#isURI(possibleURI, returnParse)', function() {
    // .........................................................................
  })
  describe('#isURIAuthority(possibleURIAuthority, returnParse)', function() {
    // .........................................................................
  })
  describe('#isURIFragment(possibleURIFragment)', function() {
    it(
      'should call the `isURIFragmentOrQuery` method, passing through own' +
        " `possibleURIFragment` argument as `isURIFragmentOrQuery`'s" +
        ' `possibleURIFragmentOrQuery` argument.'
    )
  })
  describe('#isURIFragmentOrQuery(possibleURIFragmentOrQuery)', function() {
    it('should return true when the string consists only of valid characters.')
    it(
      'should return false when the string contains characters that are not valid characters.'
    )
    it('should return false when the argument is not a string')
    it('should return true when the argument is an empty string')
  })
  describe('#isURIHierPart(possibleURIHierPart, returnParse)', function() {
    // .........................................................................
  })
  describe('#isURIHierPartOrRelativePart(possibleURIPart, type, returnParse)', function() {
    // .........................................................................
  })
  describe('#isURIHost(possibleURIHost)', function() {
    // .........................................................................
  })
  describe('#isURIIPLiteral(possibleURIIPLiteral)', function() {
    it(
      'should return true when the string matches the IP-literal ABNF pattern.'
    )
    it(
      'should return false when the string does not match the IP-literal ABNF pattern.'
    )
    it('should return false when the argument is not a string')
  })
  describe('#isURIIPv4Address(possibleURIIPv4Address)', function() {
    it(
      'should return true when the string matches the IPv4address ABNF pattern.'
    )
    it(
      'should return false when the string does not match the IPv4address ABNF pattern.'
    )
    it('should return false when the argument is not a string')
  })
  describe('#isURIIPv6Address(possibleURIIPv6Address)', function() {
    it(
      'should return true when the string matches the IPv6address ABNF pattern.'
    )
    it(
      'should return false when the string does not match the IPv6address ABNF pattern.'
    )
    it('should return false when the argument is not a string')
  })
  describe('#isURIIPvFuture(possibleURIIPvFuture)', function() {
    it('should return true when the string matches the IPvFuture ABNF pattern.')
    it(
      'should return false when the string does not match the IPvFuture ABNF pattern.'
    )
    it('should return false when the argument is not a string')
  })
  describe('#isURIOrRelativeRef(possibleURIReference, type, returnParse)', function() {
    // =========================================================================
    // .........................................................................
  })
  describe('#isURIPathAbempty(possibleURIPathAbempty)', function() {
    it(
      'should return true when the string consists only of valid path-abempty characters.'
    )
    it(
      'should return false when the string contains characters that are not valid path-abempty characters.'
    )
    it('should return false when the argument is not a string')
    it('should return true when the argument is an empty string')
  })
  describe('#isURIPathAbsolute(possibleURIPathAbsolute)', function() {
    it(
      'should return true when the string consists only of valid path-absolute characters.'
    )
    it(
      'should return false when the string contains characters that are not valid path-absolute characters.'
    )
    it('should return false when the argument is not a string')
  })
  describe('#isURIPathEmpty(possibleURIPathEmpty)', function() {
    it('should return true if the argument is an empty string', function() {
      /* eslint-disable no-unused-expressions */
      expect(URIStringValidator.isURIPathAbempty('')).to.be.true
      /* eslint-enable no-unused-expressions */
    })
    it('should return false if the argument is not an empty string', function() {
      /* eslint-disable no-unused-expressions */
      expect(URIStringValidator.isURIPathAbempty('foo')).to.be.false
      expect(URIStringValidator.isURIPathAbempty(9000)).to.be.false
      expect(URIStringValidator.isURIPathAbempty(true)).to.be.false
      expect(URIStringValidator.isURIPathAbempty(null)).to.be.false
      expect(URIStringValidator.isURIPathAbempty({})).to.be.false
      expect(URIStringValidator.isURIPathAbempty([])).to.be.false
      /* eslint-enable no-unused-expressions */
    })
  })
  describe('#isURIPathNoScheme(possibleURIPathNoScheme)', function() {
    it(
      'should return true when the string consists only of valid path-noscheme characters.'
    )
    it(
      'should return false when the string contains characters that are not valid path-noscheme characters.'
    )
    it('should return false when the argument is not a string')
  })
  describe('#isURIPathRootless(possibleURIPathRootless)', function() {
    it(
      'should return true when the string consists only of valid path-rootless characters.'
    )
    it(
      'should return false when the string contains characters that are not valid path-rootless characters.'
    )
    it('should return false when the argument is not a string')
  })
  describe('#isURIPort(possibleURIPort)', function() {
    it(
      'should return true when the string consists only of valid port characters.'
    )
    it(
      'should return false when the string contains characters that are not valid port characters.'
    )
    it('should return false when the argument is not a string')
    it('should return true when the argument is an empty string')
  })
  describe('#isURIQuery(possibleURIQuery)', function() {
    it(
      'should call the `isURIFragmentOrQuery` method, passing through own' +
        " `possibleURIQuery` argument as `isURIFragmentOrQuery`'s" +
        ' `possibleURIFragmentOrQuery` argument.'
    )
  })
  describe('#isURIReference(possibleURIReference)', function() {
    it(
      'should call the `isURI` method, passing through own' +
        " `possibleURIReference` argument as `isURI`'s `possibleURI` argument."
    )
    it(
      'should call the `isURIRelativeRef` method, passing through own' +
        " `possibleURIReference` argument as `isURIRelativeRef`'s" +
        ' `possibleURIRelativeRef` argument if the result of `isURI` is false'
    )
  })
  describe('#isURIRegName(possibleURIRegName)', function() {
    it(
      'should return true when the string consists only of valid reg-name characters.'
    )
    it(
      'should return false when the string contains characters that are not valid reg-name characters.'
    )
    it('should return false when the argument is not a string')
    it('should return true when the argument is an empty string')
  })
  describe('#isURIRelativePart(possibleURIRelativePart, returnParse)', function() {
    // .........................................................................
  })
  describe('#isURIRelativeRef(possibleURIRelativeRef, returnParse)', function() {
    // .........................................................................
  })
  describe('#isURIScheme(possibleURIScheme)', function() {
    it(
      'should return true when the string consists only of valid scheme characters.'
    )
    it(
      'should return false when the string contains characters that are not valid scheme characters.'
    )
    it('should return false when the argument is not a string')
    it('should return false if the first character is not an ALPHA character.')
  })
  describe('#isURIUserInfo(possibleURIUserinfo)', function() {
    it(
      'should return true when the string consists only of valid userinfo characters.'
    )
    it(
      'should return false when the string contains characters that are not valid userinfo characters.'
    )
    it('should return false when the argument is not a string')
  })
})
