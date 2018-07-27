import is from './is'

/**
 * Get value from object path.
 * @param {object} object
 * @param {string} path
 * @returns {(number|boolean|string|null)}
 */
export const get = (object, path) => {
  try {
    return new Function('o', `return o.${path}`)(object);
  } catch (_) {
    return null;
  }
}

const DEFAULT_VALIDATE = (value) => !is(value, 'Null')

/**
 * Get value from first object.
 * @param {string} name
 * @param {Deep[]} objects
 * @param {function(*):boolean} [validate]
 * @returns {*}
 */
export const getProperty = (name, objects, validate = DEFAULT_VALIDATE) => {
  const properties = objects.map((object) => get(object, name))
  const property = properties.find((property) => validate(property))
  return property
}

export default get
