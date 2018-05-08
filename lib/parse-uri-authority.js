'use strict'

const hasMatch = require('./internal/hasMatch')

/**
 *
 * @param {String} uriAuthority
 * @returns {Object}
 */
function parseURIAuthority(uriAuthority) {
  let atIndex
  let authority
  let effectiveAuthorityStartIndex
  let host
  let hostname
  let hostStartIndex
  let password
  let passwordMarkerIndex
  let port
  let portMarkerIndex
  let slashes
  let userinfo
  let username
  if (uriAuthority != null) {
    if (uriAuthority.startsWith('//')) {
      slashes = '//'
      effectiveAuthorityStartIndex = 2
    } else {
      effectiveAuthorityStartIndex = 0
    }
    authority = uriAuthority.substring(effectiveAuthorityStartIndex)

    // 2) If there is a first occurance of '@' in authorization then:
    atIndex = authority.indexOf('@')
    if (atIndex > -1) {
      // 2.1) Set hostStartIndex equal to atIndex + 1
      hostStartIndex = atIndex + 1

      // 2.2) Set userinfo = authority.substring(0, atIndex)
      userinfo = authority.substring(0, atIndex)

      // 2.3) Set passwordMarkerIndex to be the first occurence of ':' in userinfo
      passwordMarkerIndex = userinfo.indexOf(':')

      // 2.4) If there is a first occurence of ':' in userinfo
      if (passwordMarkerIndex > -1) {
        // 2.4.1) Set username = userinfo.substring(0, passwordMarkerIndex)
        username = userinfo.substring(0, passwordMarkerIndex)

        // 2.4.2) Set password = userinfo.substring(passwordMarkerIndex + 1)
        password = userinfo.substring(passwordMarkerIndex + 1)
      }

      // 2.5) Otherwise, set username = userinfo
      else {
        username = userinfo
      }
    }

    // 3) Otherwise,
    else {
      // 3.1) Set hostStartIndex equal to 0
      hostStartIndex = 0

      // 3.2) Set username and password to empty strings
      // username = ''
      // password = ''
    }

    // 4) Set host = authority.substring(hostStartIndex)
    host = authority.substring(hostStartIndex)

    // 5) Set portMarkerIndex to be the last occurence of ':' in host
    let portMatch = host.match(/:(0|[1-9][0-9]*)$/)

    if (hasMatch(portMatch)) {
      portMarkerIndex = host.lastIndexOf(':')
    } else {
      portMarkerIndex = -1
    }
    // 6) If there is a last occurance of ':' in host
    if (portMarkerIndex > -1) {
      // 6.1) Set hostname = host.substring(0, portMarkerIndex)
      hostname = host.substring(0, portMarkerIndex)

      // 6.2) Set port = host.substring(portMarkerIndex + 1)
      port = host.substring(portMarkerIndex + 1)
    }

    // 7) Otherwise,
    else {
      // 7.1) Set hostname equal to host
      hostname = host

      // 7.1) Set port equal to an empty string
      // port = ''
    }
  }
  return {
    host: host,
    hostname: hostname,
    password: password,
    port: port,
    slashes: slashes,
    username: username
  }
}

module.exports = parseURIAuthority
