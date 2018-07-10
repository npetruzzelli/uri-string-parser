const wptData = require('./urltestdata-wpt')

function isEmpty(input) {
  return input === '' || typeof input === 'undefined'
}

// Currently, we only end up using a fraction of the test data from WPT, but it
// still expands the list of URLs beyond what might otherwise be tested.
function convert() {
  var newData = []
  wptData.forEach(function(dataItem) {
    let authority
    let newDataItem
    let possibleSlashes
    let protocol
    let userInfo

    // If the `href` is not the same as the input, then the URL class was
    // expected to modify the input, which is a scenario that this module
    // intentionally avoids, so we won't test it.
    // Also, this module may not be capable of handling what the URL class
    // expects a to be a failure.
    if (dataItem.failure === true || dataItem.input !== dataItem.href) {
      return
    }

    // Don't attempt to convert lines that are only comments
    if (typeof dataItem === 'object') {
      newDataItem = {
        input: '',
        uri: {},
        url: {}
      }

      newDataItem.input = dataItem.input

      // PROTOCOL, SLASHES, and SCHEME
      if (!isEmpty(dataItem.protocol)) {
        protocol = dataItem.protocol
        newDataItem.url.protocol = protocol
        newDataItem.uri.scheme = protocol.substring(0, protocol.length - 1)
        possibleSlashes = dataItem.input.substr(protocol, 2)
        if (possibleSlashes === '//') {
          newDataItem.url.slashes = '//'
        }
      }

      // USERNAME and PASSWORD
      if (!isEmpty(dataItem.username)) {
        userInfo = ''
        newDataItem.url.username = dataItem.username
        userInfo += dataItem.username
      }
      if (!isEmpty(dataItem.password)) {
        userInfo = userInfo || ''
        newDataItem.url.password = dataItem.password
        userInfo += ':' + dataItem.password
      }

      // HOSTNAME and PORT
      if (!isEmpty(dataItem.hostname)) {
        newDataItem.url.hostname = dataItem.hostname
      }
      if (!isEmpty(dataItem.port)) {
        newDataItem.url.port = dataItem.port
      }

      // AUTHORITY
      if (typeof userInfo === 'string') {
        userInfo += '@'
        authority = userInfo
      }
      if (!isEmpty(dataItem.host)) {
        authority = authority || ''
        authority += dataItem.host
      }
      if (typeof authority === 'string') {
        newDataItem.uri.authority = authority
      }

      // PATHNAME and PATH
      if (!isEmpty(dataItem.pathname)) {
        newDataItem.uri.path = dataItem.pathname
        newDataItem.url.pathname = dataItem.pathname
      }

      // SEARCH and QUERY
      if (!isEmpty(dataItem.search)) {
        newDataItem.uri.query = dataItem.search.substring(1)
        newDataItem.url.search = dataItem.search
      }

      // HASH and FRAGMENT
      if (!isEmpty(dataItem.hash)) {
        newDataItem.uri.fragment = dataItem.hash.substring(1)
        newDataItem.url.hash = dataItem.hash
      }

      newData.push(newDataItem)
    }
  })
  return newData
}

module.exports = convert()
