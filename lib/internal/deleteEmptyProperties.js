'use strict'

/**
 * Iterates through own enumerable properties and deletes values that are
 * undefined or contains an empty string.
 * @param {Object} obj - The object to be iterated on.
 */
function deleteEmptyProperties(obj) {
  let p
  let propsLength
  let propName
  let propValue
  const OWN_ENUMERABLE_PROPERTIES = Object.keys(obj)
  propsLength = OWN_ENUMERABLE_PROPERTIES.length
  for (p = 0; p < propsLength; p += 1) {
    propName = OWN_ENUMERABLE_PROPERTIES[p]
    propValue = obj[propName]
    if (typeof propValue === 'undefined' || propValue === '') {
      delete obj[propName]
    }
  }
}

module.exports = deleteEmptyProperties
