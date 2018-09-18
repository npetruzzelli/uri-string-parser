'use strict'

const URITools = require('../lib/uri-tools')

function minimalParse(url) {
  var result = URITools.parse(url)
  return {
    uri: result.uri,
    url: result.url
  }
}

module.exports = minimalParse
module.exports.parse = URITools.parse
