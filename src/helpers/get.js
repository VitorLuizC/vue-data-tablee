import is from './is'

const DELIMITER = '.'

/**
 * Spreads path into fields list.
 * @param {string} path
 * @returns {Array.<string>}
 */
const getProperties = (path) => is(path, 'String') ? path.split(DELIMITER) : []

/**
 * Deep object.
 * @typedef {Object.<string, (number|boolean|string|Deep)>} Deep
 */

/**
 * Checks if a propety is reachable.
 * @param {Deep} object
 * @param {string} property
 * @returns {(number|boolean|string|null)}
 */
const getValue = (object, property) => {
  const isReachable = is(object, 'Object') && object.hasOwnProperty(property)
  const value = isReachable ? object[property] : null
  return value
}

/**
 * Get value from object path.
 * @param {Deep} object
 * @param {(string|Array.<string>)} path
 * @returns {(number|boolean|string|null)}
 */
export default (object, path) => {
  const properties = getProperties(path)
  const value = properties.reduce(getValue, object)
  return value
}
